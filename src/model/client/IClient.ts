import net from 'net';
import {Account} from "../../entity/Account";
import {ProtocolMessage} from "../../network/ankamagames/dofus/Messages";

export default interface IClient {
  socket: net.Socket;
  ticket: string | undefined;
  account: Account | undefined;

  /**
   * Logique d'interception sur le Socket pour le client.
   */
  receive: () => void;

  /**
   * Transmet un Protocole au Client Dofus par le biais du serveur Socket.
   *
   * @param ProtocolMessage
   */
  send: (message: ProtocolMessage) => void;
}
