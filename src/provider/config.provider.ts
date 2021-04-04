import {injectable} from "inversify";
import * as dotenv from "dotenv";

@injectable()
export default class ConfigProvider {
  public config: { key: string } = {};

  constructor() {
    dotenv.config();
    this.config = process.env;
  }
}