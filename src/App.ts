import "reflect-metadata";
import {injectable} from "inversify";
import {container} from "./inversify.config";
import ConfigProvider from "./provider/ConfigProvider";
import DatabaseProvider from "./provider/DatabaseProvider";
import Logger from "./cli/logger";
import Auth from "./server/Auth";
import WebServer from "./server/WebServer";
import StatusService from "./service/server/StatusService";
import World from "./server/World";

@injectable()
class App {
  private databaseProvider: DatabaseProvider;
  private configProvider: ConfigProvider;
  private logger: Logger;
  private auth: Auth;
  private statusService: StatusService;

  constructor(
    databaseProvider: DatabaseProvider,
    configProvider: ConfigProvider,
    logger: Logger,
    auth: Auth,
    statusService: StatusService,
    webServer: WebServer
  ) {
    this.databaseProvider = databaseProvider;
    this.configProvider = configProvider;
    this.logger = logger;
    this.auth = auth;
    this.statusService = statusService;

    this.init();
  }

  public async init(): Promise<void> {
    this.logger.promptHeader();

    await this.databaseProvider.getConnection();

    // Temporaire, on peut définir une variable d'autostart dans notre .env pour être logique
    Auth.start();
    World.start();
  }
}

container.resolve(App);



