import {inject, injectable, LazyServiceIdentifer} from "inversify";
import {createExpressServer, useContainer} from 'routing-controllers';
import {container} from "./../inversify.config";
import {Application} from 'express';
import {Server, Socket} from "socket.io";
import {createServer} from "http";
import IndexController from "../controller/api/IndexController";
import InstanceController from "../controller/api/InstanceController";
import StatusService from "../service/server/StatusService";

@injectable()
export default class WebServer {
  private static socket: Server;
  private static api: Application;

  public static isSocketOpen: boolean = false;
  public static isApiOpen: boolean = false;

  private statusService: StatusService;

  constructor(
    @inject(new LazyServiceIdentifer(() => StatusService)) statusService: StatusService
  ) {
    this.statusService = statusService;

    if (!WebServer.socket) {
      const http = createServer();
      WebServer.socket = new Server(http, {
        path: '/socket.io',
        cors: {
          origin: "http://localhost:3000",
          methods: ["GET", "POST"]
        }
      });

      // @ts-ignore
      http.listen('8181', {host: '0.0.0.0'});

      WebServer.socket.on('connect', (socket: Socket) => {
        WebServer.isSocketOpen = true;
      });

      WebServer.socket.on('connection', (socket: Socket) => {
        setTimeout(() => {
          StatusService.sendStatus();
        }, 1000);
      });
    }
    if (!WebServer.api) {
      useContainer(container);
      WebServer.api = createExpressServer({
        controllers: [IndexController, InstanceController],
      });

      // @ts-ignore
      WebServer.api.listen('8080', {host: '0.0.0.0'}, () => {
        WebServer.isApiOpen = true;
      });
    }
  }

  public static getSocket(): Server {
    return WebServer.socket;
  }

  public static getApi(): Application {
    return WebServer.api;
  }

  public static emit(event: string, data: any): void {
    WebServer.socket.emit(event, data);
  }
}
