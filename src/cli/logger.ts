import {injectable} from "inversify";
import * as figlet from "figlet";
import chalk from "chalk";
import ConfigProvider from "../provider/config.provider";

@injectable()
export default class Logger {
  private configProvider: ConfigProvider;

  constructor(configProvider: ConfigProvider) {
    this.configProvider = configProvider;
  }

  public promptHeader()
  {
    // @ts-ignore
    const version = this.configProvider.config.npm_package_version;
    // @ts-ignore
    const author = this.configProvider.config.npm_package_author_name;
    // @ts-ignore
    const authorURL = this.configProvider.config.npm_package_author_url;
    // @ts-ignore
    const description = this.configProvider.config.npm_package_description;
    // @ts-ignore
    const appName = this.configProvider.config.APP_NAME;

    console.log(chalk.yellow(figlet.textSync(`${appName} release ${version}`, {
      width: 500,
      horizontalLayout: 'full',
      verticalLayout: 'default',
      whitespaceBreak: true
    })));
    console.log(chalk.yellow(`              ${description} by ${author} (${authorURL}).`));
    console.log(chalk.yellow("              __________________________________________________________________________________"));
    console.log("");
  }

  public promptLog(color: string, header: string, message: string) {
    console.log(`[${chalk.keyword(color)(header)}] : ${message.toString()}`);
  }

  public infos(message: string) {
    this.promptLog('green', 'INFORMATIONS', message);
  }

  public debug(message: string) {
    this.promptLog('magenta', 'DEBUG', message);
  }

  public network(message: string) {
    this.promptLog('cyan', 'NETWORK', message);
  }

  public error(message: string, error: any) {
    this.promptLog('red', 'ERREUR', message);
    if (error) {
      console.error(error);
    }
  }
}
