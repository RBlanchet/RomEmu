import {injectable} from "inversify";
import StatusService from "../service/server/StatusService";
import net from "net";
import WebServer from "./web";
import Client from "../model/Client";

@injectable()
export default class Auth {
  private static socket: net.Server;
  private static clients: Array<Client> = []; // @TODO: Envisager le stockage des instances, par le ticket qu'on créera par la suite

  public static isAuthOpen: boolean = false;

  public static start(): void {
    if (!Auth.socket) {
      const socket = net.createServer((socket: net.Socket) => {
        try {
          Auth.clients.push(new Client(socket));
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

  public static removeClient(client: Client) {
    const index = Auth.getClients().indexOf(client);
    if (index !== -1) {
      Auth.clients.splice(index, 1);
    }
  }

  public static getClients(): Array<Client> {
    return Auth.clients;
  }
}
