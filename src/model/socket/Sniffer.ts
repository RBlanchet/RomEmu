import Packet from "../Packet";
import TimestampFactory from "../../factory/TimestampFactory";
import IClient from "../client/IClient";

export default class Sniffer {
  private readonly client: IClient;
  private readonly packet: Packet;

  constructor(
    client: IClient,
    packet: Packet
  ) {
    this.client = client;
    this.packet = packet;
  }

  public serialize() {
    return {
      time: TimestampFactory.now(),
      ticket: this.client.ticket,
      // @ts-ignore
      packet: this.packet.serialize(),
    };
  }
}
