import {EntityRepository, Repository} from "typeorm";
import {Account} from "../entity/Account";

@EntityRepository(Account)
export default class AccountRepository extends Repository<Account>{
  public async findByUsernameAndPassword(username: string, password: string): Promise<Account|undefined> {
    return await this.findOne({username, password});
  }
}
