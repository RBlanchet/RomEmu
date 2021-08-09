import {injectable} from "inversify";
import * as dotenv from "dotenv";

@injectable()
export default class ConfigProvider {
  // @ts-ignore
  public config: { key: string } = {};

  constructor() {
    dotenv.config();
    // @ts-ignore
    this.config = process.env;
  }
}
