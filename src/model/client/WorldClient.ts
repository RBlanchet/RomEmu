import IClient from "./IClient";
import {Account} from "../../entity/Account";
import net from "net";
import crypto from "crypto";
import ProcessHandler from "../../handler/ProcessHandler";
import PacketFactory from "../../factory/PacketFactory";
import {ProtocolMessage} from "../../network/ankamagames/dofus/Messages";
import PacketMessenger from "../../messenger/PacketMessenger";

/**
 * @augments IClient
 * @class
 * @classdesc Client de connexion au serveur world, à chaque identification au serveur world, un client est créér.
 */
export default class WorldClient implements IClient{
  private readonly _socket: net.Socket;
  private _ticket: string | undefined;
  private _account: Account | undefined = undefined;

  constructor(socket: net.Socket) {
    this._socket = socket;

    // On écoute les connections au Socket
    this.receive();
  }

  /**
   * @inheritDoc
   */
  receive(): void {
    // A la reception de donnée, le packet est crée, puis envoyé à notre gestionnaire de corrélation de Message.
    this._socket.on('data', data => {
      ProcessHandler.handle(PacketFactory.create(data, this));
    });
  }

  /**
   * @inheritDoc
   */
  send(message: ProtocolMessage): void {
    PacketMessenger.send(message, this);
  }

  // Accesseur et mutateur
  get account(): Account | undefined {
    return this._account;
  }

  set account(value: Account | undefined) {
    this._account = value;
  }

  get ticket(): string | undefined {
    return this._ticket;
  }

  set ticket(ticket: string | undefined) {
    this._ticket = ticket;
  }

  get socket(): net.Socket {
    return this._socket;
  }
}
