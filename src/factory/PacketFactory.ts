import {injectable} from "inversify";
import Packet from "../model/Packet";
import IClient from "../model/client/IClient";

@injectable()
export default class PacketFactory {
  public static create(buffer: Buffer, client: IClient): Packet {
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
