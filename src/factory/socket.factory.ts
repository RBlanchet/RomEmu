import {injectable} from "inversify";
import * as net from "net";
import Logger from "../cli/logger";

@injectable()
export default class SocketFactory {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public create(closure: (socket: net.Socket) => void, port: number) {
    const server = net.createServer((socket: net.Socket) => {
      try {
        closure(socket);
        this.logger.debug(`Un nouveau client s'est connecté sur le port ${port}`);
      } catch (e) {
        this.logger.error(`Une nouvelle connexion à été detecté sur le port ${port}, mais une erreur est survenue.` , e);
      }
    });

    server.listen({port, host: '0.0.0.0'}, () => {
      this.logger.infos(`Un nouveau serveur à été identifié sur le port ${port}`);
    });
  }
}