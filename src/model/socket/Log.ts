import LogType from "../../enum/socket/LogType";
import TimestampFactory from "../../factory/TimestampFactory";

export default class Log {
  private readonly type!: LogType;
  private readonly message!: String;

  constructor(
    type: LogType,
    message: String
  ) {
    this.type = type;
    this.message = message;
  }

  public serialize() {
    return {
      time: TimestampFactory.now(),
      type: this.type,
      message: this.message,
    };
  }
}
