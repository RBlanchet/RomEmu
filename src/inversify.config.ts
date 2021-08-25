import {Container} from "inversify";
import ConfigProvider from "./provider/config.provider";
import DatabaseProvider from "./provider/database.provider";
import Logger from "./cli/logger";
import Auth from "./server/auth";
import WebServer from "./server/web";
import StatusService from "./service/server/StatusService";
import InstanceController from "./controller/api/InstanceController";
import AuthController from "./controller/AuthController";
import AccountRepository from "./repository/account.repository";

const container = new Container();

// Configuration
container.bind<Logger>(Logger).to(Logger);
container.bind<ConfigProvider>(ConfigProvider).to(ConfigProvider);
container.bind<DatabaseProvider>(DatabaseProvider).to(DatabaseProvider);

// Service
container.bind<StatusService>(StatusService).to(StatusService);

// Repository
container.bind<AccountRepository>(AccountRepository).to(AccountRepository);

// Controllers
container.bind<InstanceController>(InstanceController).to(InstanceController);
container.bind<AuthController>(AuthController).to(AuthController).inSingletonScope();

// Server
container.bind<Auth>(Auth).to(Auth);
container.bind<WebServer>(WebServer).to(WebServer).inSingletonScope();

export {container};
