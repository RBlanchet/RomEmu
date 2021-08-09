import "reflect-metadata";
import {injectable} from "inversify";
import {container} from "./inversify.config";
import ConfigProvider from "./provider/config.provider";
import DatabaseProvider from "./provider/database.provider";
import AccountRepository from "./repository/account.repository";
import {getCustomRepository} from "typeorm";
import {Role} from "./enum/role";
import Logger from "./cli/logger";
import Auth from "./server/auth";
import WebServer from "./server/web";
import StatusService from "./service/server/StatusService";

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
  }
}

container.resolve(App);



