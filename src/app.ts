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

@injectable()
class App {
  private databaseProvider: DatabaseProvider;
  private configProvider: ConfigProvider;
  private logger: Logger;
  private auth: Auth;

  constructor(
    databaseProvider: DatabaseProvider,
    configProvider: ConfigProvider,
    logger: Logger,
    auth: Auth
  ) {
    this.databaseProvider = databaseProvider;
    this.configProvider = configProvider;
    this.logger = logger;
    this.auth = auth;

    this.init();
  }

  public async init(): Promise<void> {
    this.logger.promptHeader();

    await this.databaseProvider.getConnection();
    await this.auth.init();
  }
}

container.resolve(App);



