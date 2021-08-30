import ByteArray from './../network/ankamagames/dofus/ByteArray';
import * as Messages from './../network/ankamagames/dofus/Messages';
import IO from "../network/ankamagames/dofus/structures/CustomDataWrapper";
import {ProtocolMessage} from "./../network/ankamagames/dofus/Messages";
import IClient from "./client/IClient";

/**
 * Interprête un buffer provenant d'un client via le protocole TCP.
 *
 * @param buffer Buffer provenant du client de Dofus via le protocole TCP
 * @param client Objet client ayant les informations du client qui émet le buffer
 */
export default class Packet {
  // Propriété du constructeur
  private readonly _buffer: ArrayBuffer;
  private readonly _client: IClient;

  // Propriété propre à la classe
  // @ts-ignore
  private _temporaryByteArray: ByteArray = new ByteArray();
  // @ts-ignore
  private _byteArray: ByteArray;
  private _length: number = 0;
  private _messageId: number = 0;
  private _isSplitPacket: boolean = false;
  private _message!: ProtocolMessage;

  constructor(buffer: ArrayBuffer, client: IClient) {
    this._buffer = buffer;
    this._client = client;

    this.decode();
  }

  /**
   * Décode un Packet TCP afin de pouvoir définir toutes les propriétés qu'on a besoin pour notre application.
   *
   * @private
   */
  private decode(): void
  {
    this._byteArray = new ByteArray(this._buffer);

    // Tant que le ByteArray possède des bits disponible, nous continuons le traitement
    while (this._byteArray.bytesAvailable > 0) {
      if (this._isSplitPacket) {
        this.continueQueueIfPacketSplitted();
      } else {
        this.startQueue();
      }
    }
  }

  /**
   * Démarre la frame d'interpretation d'un packet, dans le cas ou le packet n'est pas complet, ce qui veut dire qu'il
   * est composé de plusieurs packet pour former un message, nous indiquons à notre classe qu'il faudra continuer
   * l'interprétation de notre packet.
   *
   * @private
   */
  private startQueue(): void
  {
    if (this._byteArray.bytesAvailable < 2) {
      throw new Error("Le packet est incomplet");
    }

    /** On commence à lire l'entête de notre packet, celui ci contiendra diverses informations **/
    const hiHeader = this._byteArray.readUnsignedShort();

    // L'ID du message provenant du Client
    this._messageId = hiHeader >> 2;

    // Determine la taille sur laquelle le prochain paquet devra être lu
    const lengthType = hiHeader & 3;

    switch (lengthType) {
      case 1:
        this._length = this._byteArray.readUnsignedByte();
        break;
      case 2:
        this._length = this._byteArray.readUnsignedShort();
        break;
      case 3:
        this._length = ((this._byteArray.readByte() & 255) << 16) + ((this._byteArray.readByte() & 255) << 8) + (this._byteArray.readByte() & 255);
        break;
      default:
        this._length = 0;
    }

    // Si notre longueur définit par lengthType est supérieur au nombre de byte disponible, le packet est "splité".
    this._isSplitPacket = this._length > this._byteArray.bytesAvailable;

    // Nous stockons les données interprétés dans notre ByteArray afin de continuer la frame
    if (this._isSplitPacket) {
      this._byteArray.readBytes(this._temporaryByteArray, this._temporaryByteArray.length, this._byteArray.bytesAvailable);
    } else {
      this.determineDofusPacket();
    }
  }

  /**
   * S'execute dans le cas ou le packet est de type "splité", cela veut dire donc qu'un packet TCP n'a pas suffit à
   * recolter les informations dont on a besoin.
   *
   * @private
   */
  private continueQueueIfPacketSplitted(): void
  {
    if (this._temporaryByteArray.length + this._byteArray.bytesAvailable < this._length) {
      // Cela indique que le contenu est encore étendu au prochain packet
      this._byteArray.readBytes(this._temporaryByteArray, this._temporaryByteArray.length, this._byteArray.bytesAvailable);
    } else {
      // Nous possèdons le dernier packet
      this._byteArray.readBytes(this._temporaryByteArray, this._temporaryByteArray.length, this._length - this._temporaryByteArray.length);

      this._temporaryByteArray.position = 0;

      this.determineDofusPacket();

      this._isSplitPacket = false;
    }
  }

  /**
   * Vient corréler notre Packet avec les Messages de Dofus.
   *
   * @private
   */
  private determineDofusPacket(): void
  {
    // Nous allons définir la position de base lorsque nous recevons notre ByteArray
    const initialPosition = this._byteArray.position;

    // Nous allons chercher dans nos données si nous avons un message pour l'id contenu dans notre packet.
    const messageObject = Object.keys(Messages).find(m => {
      // @ts-ignore
      return Messages[m].messageId === this._messageId
    });

    if (!messageObject) {
      throw new Error(`Impossible de trouver une correspondance pour le packet possèdant le message ${this._messageId}`);
    }

    this._message = new (<any>Messages)[messageObject]();
    // @ts-ignore
    this._message.deserialize(new IO.CustomDataWrapper(this._byteArray));

    // Dans le cas ou il nous de la longueur, nous rejetons donc les packets "non consommé"
    if (this._length - (this._byteArray.position - initialPosition) !== 0) {
      this._byteArray.position = initialPosition + this._length;
    }
  }

  get message(): ProtocolMessage
  {
    return this._message;
  }

  get client(): IClient {
    return this._client;
  }
}
