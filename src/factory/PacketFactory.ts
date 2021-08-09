import {injectable} from "inversify";
import Packet from "../model/Packet";
import Client from "../model/Client";

@injectable()
export default class PacketFactory {
  public static create(buffer: Buffer, client: Client): Packet {
    return new Packet(this.convertToArrayBuffer(buffer), client);
  }

  private static convertToArrayBuffer(buffer: Buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }

    return arrayBuffer;
  }
}
