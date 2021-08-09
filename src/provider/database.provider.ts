import {Connection, createConnection} from "typeorm";
import ConfigProvider from "./config.provider";
import {injectable} from "inversify";
import Logger from "../cli/logger";

@injectable()
export default class DatabaseProvider {
  private instance: Connection | undefined;
  private configProvider: ConfigProvider;
  private logger: Logger;

  constructor(
    configProvider: ConfigProvider,
    logger: Logger
  ) {
    this.configProvider = configProvider;
    this.logger = logger;
  }

  public async getConnection()
  {
    if (!this.instance) {
      try {
        this.instance = await createConnection({
          // @ts-ignore
          type: this.configProvider.config.DATABASE_TYPE,
          // @ts-ignore
          host: this.configProvider.config.DATABASE_HOST,
          // @ts-ignore
          port: this.configProvider.config.DATABASE_PORT,
          // @ts-ignore
          database: this.configProvider.config.DATABASE_NAME,
          entities: [__dirname + '/../**/*.js'],
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        this.logger.infos("Connexion à la base effectuée avec succès.");
      } catch (e) {
        this.logger.error('Impossible de se connecter à la base', e);
      }
    }
  }

  public getInstance(): Connection | undefined
  {
    return this.instance;
  }
}
