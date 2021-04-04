import {Container} from "inversify";
import ConfigProvider from "./provider/config.provider";
import DatabaseProvider from "./provider/database.provider";

const container = new Container();

container.bind<ConfigProvider>(ConfigProvider).to(ConfigProvider);
container.bind<DatabaseProvider>(DatabaseProvider).to(DatabaseProvider);

export {container};