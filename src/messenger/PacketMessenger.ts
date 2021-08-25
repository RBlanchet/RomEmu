import IO from "../network/ankamagames/dofus/structures/CustomDataWrapper";
import ByteArray from "../network/ankamagames/dofus/ByteArray";
import arrayBufferToBuffer from "arraybuffer-to-buffer";
import Client from "../model/Client";
import WebServer from "../server/web";
import * as Messages from "../network/ankamagames/dofus/Messages";

export default class PacketMessenger {
  private static BIT_RIGHT_SHIFT_LEN_PACKET_ID = 2;

  public static send(message: Messages, client: Client) {
    try {
      message.serialize();
      const messageBuffer = new IO.CustomDataWrapper(new ByteArray());
      let offset = PacketMessenger.write(messageBuffer, message.messageId, message.buffer._data);
      const buffer = arrayBufferToBuffer(messageBuffer.data.buffer);
      offset = offset === undefined ? 2 : offset;

      client.getSocket().write(buffer.slice(0, message.buffer._data.write_position + offset));

      WebServer.emit('auth', {type: 'network', message: `Paquet envoyé <b>${message.constructor.name}</b> (id: ${message.messageId})`});
    } catch (e) {
      console.error(e);
      // @TODO: Catcher l'erreur et la logger.
    }
  }

  private static write(buffer, id, data) {
    let _loc5_ = 0;
    let _loc6_ = 0;
    const _loc4_ = PacketMessenger.computeTypeLen(data.write_position);
    buffer.writeShort(PacketMessenger.subComputeStaticHeader(id, _loc4_));
    switch (_loc4_) {
      case 0:
        return;
      case 1:
        buffer.writeByte(data.write_position);
        break;
      case 2:
        buffer.writeShort(data.write_position);
        break;
      case 3:
        _loc5_ = data.write_position >> 16 & 255;
        _loc6_ = data.write_position & 65535;
        buffer.writeByte(_loc5_);
        buffer.writeShort(_loc6_);
        break;
    }
    const offset = buffer._data.write_position;
    buffer.writeBytes(data);

    return offset;
  }

  private static computeTypeLen(position) {
    if (position > 65535) {
      return 3;
    }
    if (position > 255) {
      return 2;
    }
    if (position > 0) {
      return 1;
    }

    return 0;
  }

  private static subComputeStaticHeader(id, location) {
    return id << PacketMessenger.BIT_RIGHT_SHIFT_LEN_PACKET_ID | location;
  }

  private static getPacketLength(buffer, length) {
    let packetLen = 0;
    switch (length) {
      case 1:
        packetLen = buffer.readByte();
        break;

      case 2:
        packetLen = buffer.readByte();
        break;

      case 3:
        packetLen = ((buffer.readByte() & 255) << 16) + ((buffer.readByte() & 255) << 8) + (buffer.readByte() & 255);
        break;

      default:
        packetLen = 0;
        break;
    }
    return packetLen;
  }
}
