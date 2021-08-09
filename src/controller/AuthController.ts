import {injectable} from "inversify";
import Logger from "../cli/logger";

@injectable()
export default class AuthController {
  private logger: Logger;

  constructor(
    logger: Logger
  ) {
    this.logger = logger;
  }

  public login() {
    this.logger.infos('test');
    // @TODO: Méthode de login
  }
}
