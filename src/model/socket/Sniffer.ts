import Client from "../Client";
import Packet from "../Packet";
import TimestampFactory from "../../factory/TimestampFactory";

export default class Sniffer {
  private readonly client: Client;
  private readonly packet: Packet;

  constructor(
    client: Client,
    packet: Packet
  ) {
    this.client = client;
    this.packet = packet;
  }

  public serialize() {
    return {
      time: TimestampFactory.now(),
      instance: this.client.getUid(),
      packet: this.packet.serialize(),
    };
  }
}
