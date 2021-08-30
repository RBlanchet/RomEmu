import {Container} from "inversify";
import ConfigProvider from "./provider/ConfigProvider";
import DatabaseProvider from "./provider/DatabaseProvider";
import Logger from "./cli/logger";
import Auth from "./server/Auth";
import WebServer from "./server/WebServer";
import StatusService from "./service/server/StatusService";
import InstanceController from "./controller/api/InstanceController";
import AuthController from "./controller/AuthController";
import AccountRepository from "./repository/AccountRepository";

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
