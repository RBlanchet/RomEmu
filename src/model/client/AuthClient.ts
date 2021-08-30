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
 * @classdesc Client de connexion au serveur d'auth, à chaque identification au serveur d'auth, un client est créér.
 */
export default class AuthClient implements IClient{
  private readonly _socket: net.Socket;
  private readonly _ticket: string;
  private _account: Account | undefined = undefined;

  constructor(socket: net.Socket) {
    this._socket = socket;
    this._ticket = crypto.randomBytes(42).toString('hex');

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

  get ticket(): string {
    return this._ticket;
  }

  get socket(): net.Socket {
    return this._socket;
  }
}
