import {injectable} from "inversify";
import StatusService from "../service/server/StatusService";
import net from "net";
import WebServer from "./WebServer";
import AuthClient from "../model/client/AuthClient";
import * as Messages from "../network/ankamagames/dofus/Messages";
import {Account} from "../entity/Account";

@injectable()
export default class Auth {
  private static socket: net.Server;
  public static clients: Array<AuthClient> = [];
  public static isAuthOpen: boolean = false;

  public static start(): void {
    if (!Auth.socket) {
      const socket = net.createServer((socket: net.Socket) => {
        try {
          const client = new AuthClient(socket);
          this.addClients(client);
          client.send(new Messages.ProtocolRequiredMessage(1738, 1738));
          client.send(new Messages.HelloConnectMessage("ivu9wh58^kQQw*8n:jud11Kw(bHY9m3V", 303));
        } catch (e) {
          WebServer.emit('auth', {type: 'error', message: 'Une erreur est survenue lors de la connexion de l\'instance'});
        }
      });

      socket.listen({port: 443, host: '0.0.0.0'}, () => {
        Auth.isAuthOpen = true;
        Auth.socket = socket;
        setTimeout(() => {
          StatusService.sendStatus();
          WebServer.emit('auth', {type: 'info', message: `Serveur lancé sur le port 443.`})
        }, 1000);
      });
    }
  }

  public static addClients(client: AuthClient): void
  {
    Auth.clients.push(client);
  }

  public static getClientByAccount(account: Account | undefined): AuthClient | undefined {
    return account ? Auth.clients.find(c => c.account?._id === account._id) : undefined;
  }

  public static getClientByTicket(ticket: string): AuthClient | undefined {
    return Auth.clients.find(c => c.ticket === ticket);
  }
}
