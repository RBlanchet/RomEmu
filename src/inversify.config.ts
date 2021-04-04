import {Container} from "inversify";
import ConfigProvider from "./provider/config.provider";
import DatabaseProvider from "./provider/database.provider";
import Logger from "./cli/logger";

const container = new Container();

container.bind<Logger>(Logger).to(Logger);
container.bind<ConfigProvider>(ConfigProvider).to(ConfigProvider);
container.bind<DatabaseProvider>(DatabaseProvider).to(DatabaseProvider);

export {container};