import ByteArray from './../network/ankamagames/dofus/ByteArray';
import * as Messages from './../network/ankamagames/dofus/Messages';
import WebServer from "../server/web";
import Client from "./Client";
import Log from "./socket/Log";
import LogType from "../enum/socket/LogType";
import Sniffer from "./socket/Sniffer";
import IO from "../network/ankamagames/dofus/structures/CustomDataWrapper";

export enum PacketSource {
  CLIENT,
  SERVER,
}

export default class Packet {
  private temporaryBa: ByteArray = new ByteArray();
  private buffer: ArrayBuffer;
  private source: PacketSource;
  private byteArray: ByteArray;
  private packetId!: Number;
  private length: Number = 0;
  private splitPacket: Boolean = false;
  private message!: Messages.ProtocolMessage;
  private client: Client;

  constructor(buffer: ArrayBuffer, client: Client) {
    this.buffer = buffer;
    this.source = 1; //@TODO: Voir l'utilité de cette variable
    this.byteArray = new ByteArray(buffer);
    this.client = client;

    while (this.byteArray.bytesAvailable > 0) {
      this.decodeHeader();
      this.determineIfSplitPackage();
      this.decodeDofusMessage();
    }
  }

  private decodeHeader() {
    if (this.byteArray.bytesAvailable < 2) {
      throw new Error('Paquet vide');
      return;
    }

    const header = this.byteArray.readUnsignedShort();

    this.packetId = header >> 2;
    this.length = 0;

    const lengthType = header & 3;
    let instanceId = -1;

    if (this.source === PacketSource.CLIENT) {
      instanceId = this.byteArray.readUnsignedInt();
    }

    if (lengthType === 0) {
      this.length = 0;
    } else if (lengthType === 1) {
      this.length = this.byteArray.readUnsignedByte();
    } else if (lengthType === 2) {
      this.length = this.byteArray.readUnsignedShort();
    } else if (lengthType === 3) {
      this.length = ((this.byteArray.readByte() & 255) << 16) + ((this.byteArray.readByte() & 255) << 8) + (this.byteArray.readByte() & 255);
    }
  }

  private determineIfSplitPackage() {
    if (this.length > this.byteArray.bytesAvailable) {
      this.splitPacket = true;

      this.byteArray.readBytes(this.temporaryBa, this.temporaryBa.length, this.byteArray.bytesAvailable);
    }
  }

  private decodeDofusMessage() {
    const initialPos = this.byteArray.position;
    const messageObject = Object.keys(Messages).find(m => Messages[m].messageId === this.packetId);
    if (!messageObject) {
      WebServer.emit('auth', (new Log(LogType.ERROR, `Impossible de trouver le message pour l'id ${this.packerId}`)).serialize());
    } else {
      this.message = new (<any>Messages)[messageObject]();
      this.message.deserialize(new IO.CustomDataWrapper(this.byteArray));
      WebServer.emit('sniffer', (new Sniffer(this.client, this)).serialize());
    }
  }

  public serialize() {
    return {
      message: this.message.constructor.name,
      body: this.message,
    };
  }

  public getMessage() {
    return this.message;
  }

  public getClient(): Client {
    return this.client;
  }
}
