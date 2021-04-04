import {Container} from "inversify";
import ConfigProvider from "./provider/config.provider";
import DatabaseProvider from "./provider/database.provider";
import Logger from "./cli/logger";
import SocketFactory from "./factory/socket.factory";
import Auth from "./server/auth";

const container = new Container();

// Configuration
container.bind<Logger>(Logger).to(Logger);
container.bind<ConfigProvider>(ConfigProvider).to(ConfigProvider);
container.bind<DatabaseProvider>(DatabaseProvider).to(DatabaseProvider);

// Factory
container.bind<SocketFactory>(SocketFactory).to(SocketFactory);

// Server
container.bind<Auth>(Auth).to(Auth);

export {container};