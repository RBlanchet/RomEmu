import {Entity, ObjectIdColumn, ObjectID, Column, Generated, PrimaryColumn} from "typeorm";
import {Role} from '../enum/role';

@Entity({name: 'accounts'})
export class Account {
  @ObjectIdColumn()
  _id!: ObjectID;

  @Generated("uuid")
  uid: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.PLAYER
  })
  scope: Role;

  @Column()
  locked: boolean;

  @Column({name: 'secret_question'})
  secretQuestion: string;
}
