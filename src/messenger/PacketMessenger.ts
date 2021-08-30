import {CustomDataWrapper} from "../network/ankamagames/dofus/structures/CustomDataWrapper";
import ByteArray from "../network/ankamagames/dofus/ByteArray";
import arrayBufferToBuffer from "arraybuffer-to-buffer";
import {ProtocolMessage} from "../network/ankamagames/dofus/Messages";
import IClient from "../model/client/IClient";

export default class PacketMessenger {
  private static BIT_RIGHT_SHIFT_LEN_PACKET_ID = 2;

  /**
   * Envoie un message en l'encodant au client passé en paramètre.
   *
   * @static
   */
  public static send(message: ProtocolMessage, client: IClient): void
  {
    try {
      // @ts-ignore On sérialize le message en écrivant dans son buffer interne
      message.serialize();

      // Instanciation du CustomWrapper possèdant les informations du protocole puis nous écrivons les données dedans
      const wrapper = new CustomDataWrapper();
      let offset = PacketMessenger.write(wrapper, message.messageId, message.buffer._data);

      // Transformation du buffer en ArrayBuffer
      const buffer = arrayBufferToBuffer(wrapper.data.buffer);

      // Dans le cas ou l'offset est undefined (la longueur du packet n'est pas reconnu), on estime sa longueur à 2
      offset = offset === undefined ? 2 : offset;

      // Le client récupère son socket associé, puis envoie cette donnée à Dofus
      client.socket.write(buffer.slice(0, message.buffer._data.write_position + offset));
    } catch (e) {
      console.error(e);
      // @TODO: Catcher l'erreur et la logger.
    }
  }

  /**
   * S'occupe d'écrire dans le Wrapper les différents informations utiles au protocole Dofus.
   *
   * @static
   * @private
   */
  // @ts-ignore
  private static write(wrapper: CustomDataWrapper, id: number, data: ByteArray): number|undefined
  {
    // Nous allons determiner le type de Packet nous écrivons
    let typeLen = 0;
    switch (true) {
      case data.write_position > 65535:
        typeLen = 3;
        break;
      case data.write_position > 255:
        typeLen = 2;
        break;
      case data.write_position > 0:
        typeLen = 1;
        break;
    }
    wrapper.writeShort(id << PacketMessenger.BIT_RIGHT_SHIFT_LEN_PACKET_ID | typeLen);

    // Selon le type de Packet, l'inscription dans le buffer est différent
    switch (typeLen) {
      case 0:
        return;
      case 1:
        wrapper.writeByte(data.write_position);
        break;
      case 2:
        wrapper.writeShort(data.write_position);
        break;
      case 3:
        const byte = data.write_position >> 16 & 255;
        const short = data.write_position & 65535;
        wrapper.writeByte(byte);
        wrapper.writeShort(short);
        break;
    }
    const offset = wrapper._data.write_position;
    wrapper.writeBytes(data);

    return offset;
  }
}
