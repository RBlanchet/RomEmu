import {EntityRepository, Repository} from "typeorm";
import {Account} from "../entity/account";
import {injectable} from "inversify";

@EntityRepository(Account)
export default class AccountRepository extends Repository<Account>{
}