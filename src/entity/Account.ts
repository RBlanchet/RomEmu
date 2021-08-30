import {Entity, ObjectIdColumn, ObjectID, Column, Generated, PrimaryColumn} from "typeorm";
import {Role} from '../enum/Role';

@Entity({name: 'account'})
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
  role: Role;

  @Column()
  locked: boolean;

  @Column({name: 'secret_question'})
  secretQuestion: string;

  constructor(
    uid: number,
    username: string,
    password: string,
    nickname: string,
    role: Role,
    locked: boolean,
    secretQuestion: string
  ) {
    this.uid = uid;
    this.username = username;
    this.password = password;
    this.nickname = nickname;
    this.role = role;
    this.locked = locked;
    this.secretQuestion = secretQuestion;
  }
}
