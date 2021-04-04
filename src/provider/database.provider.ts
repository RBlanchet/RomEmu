import {Connection, createConnection} from "typeorm";
import ConfigProvider from "./config.provider";
import {injectable} from "inversify";

@injectable()
export default class DatabaseProvider {
  private instance: Connection | undefined;
  private configProvider: ConfigProvider;

  constructor(configProvider: ConfigProvider) {
    this.configProvider = configProvider;
  }

  public async getConnection()
  {
    if (!this.instance) {
      this.instance = await createConnection({
        type: this.configProvider.config.DATABASE_TYPE,
        host: this.configProvider.config.DATABASE_HOST,
        port: this.configProvider.config.DATABASE_PORT,
        database: this.configProvider.config.DATABASE_NAME,
        entities: [__dirname + '/../**/*.js']
      });
    }
  }

  public getInstance(): Connection | undefined
  {
    return this.instance;
  }
}