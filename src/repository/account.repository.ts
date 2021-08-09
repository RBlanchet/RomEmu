import {EntityRepository, Repository} from "typeorm";
import {Account} from "../entity/account";

@EntityRepository(Account)
export default class AccountRepository extends Repository<Account>{
}
