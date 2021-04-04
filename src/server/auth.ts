import {injectable} from "inversify";
import Logger from "../cli/logger";
import SocketFactory from "../factory/socket.factory";
import ConfigProvider from "../provider/config.provider";
import * as net from "net";

@injectable()
export default class Auth {
  private logger: Logger;
  private socketFactory: SocketFactory;
  private configProvider: ConfigProvider;

  constructor(
    logger: Logger,
    socketFactory: SocketFactory,
    configProvider: ConfigProvider
  ) {
    this.logger = logger;
    this.socketFactory = socketFactory;
    this.configProvider = configProvider;
  }

  public async init(): Promise<void> {
    this.socketFactory.create(socket => {
      this.handleSocket(socket);
    }, this.configProvider.config.AUTH_PORT);
  }

  private handleSocket(socket: net.Socket): void {
    socket.on('data', data => {
      // @TODO: Read packet buffer.
    });
  }
}
