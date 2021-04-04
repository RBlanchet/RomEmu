import "reflect-metadata";
import {injectable} from "inversify";
import {container} from "./inversify.config";
import ConfigProvider from "./provider/config.provider";
import DatabaseProvider from "./provider/database.provider";
import AccountRepository from "./repository/account.repository";
import {getCustomRepository} from "typeorm";
import {Role} from "./enum/role";

@injectable()
class App {
  private databaseProvider: DatabaseProvider;
  private configProvider: ConfigProvider;

  constructor(
    databaseProvider: DatabaseProvider,
    configProvider: ConfigProvider,
  ) {
    this.databaseProvider = databaseProvider;
    this.configProvider = configProvider;

    this.init();
  }

  public async init(): Promise<void> {
    await this.databaseProvider.getConnection();

    // Exemple d'utilisation d'un repository
    const accountRepository = getCustomRepository(AccountRepository);
    const account = accountRepository.create({
      username: 'Test',
      password: 'Test',
      nickname: 'CompteTest',
      locked: false,
      scope: Role.CREATOR,
      secretQuestion: 'Supprimer ?'
    });
    await accountRepository.insert(account);
  }
}

container.resolve(App);



