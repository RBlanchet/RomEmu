import {injectable} from "inversify";
import StatusService from "../service/server/StatusService";
import net from "net";
import WebServer from "./WebServer";
import Client from "../model/Client";
import * as Messages from "../network/ankamagames/dofus/Messages";
import WorldClient from "../model/client/WorldClient";

@injectable()
export default class World {
  private static socket: net.Server;
  private static clients: Array<WorldClient> = [];

  public static isWorldOpen: boolean = false;

  public static start(): void {
    if (!World.socket) {
      const socket = net.createServer((socket: net.Socket) => {
        try {
          const client = new WorldClient(socket);
          this.clients.push(client);
          client.send(new Messages.ProtocolRequiredMessage(1738, 1738));
          client.send(new Messages.HelloGameMessage());
        } catch (e) {
          WebServer.emit('world', {type: 'error', message: 'Une erreur est survenue lors de la connexion de l\'instance'});
        }
      });

      socket.listen({port: 5555, host: '0.0.0.0'}, () => {
        World.isWorldOpen = true;
        World.socket = socket;
        setTimeout(() => {
          StatusService.sendStatus();
          WebServer.emit('world', {type: 'info', message: `Serveur lancé sur le port 5555.`})
        }, 1000);
      });
    }
  }

  public static removeClient(client: WorldClient) {
    const index = World.getClients().indexOf(client);
    if (index !== -1) {
      World.clients.splice(index, 1);
    }
  }

  public static getClients(): Array<WorldClient> {
    return World.clients;
  }
}
