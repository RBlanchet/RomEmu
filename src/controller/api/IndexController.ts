import {Get, JsonController, Render} from "routing-controllers";
import {injectable} from "inversify";

@JsonController("/")
@injectable()
export default class IndexController {
  @Get("")
  get() {
    return 'Bienvenu sur l\'index';
  }
}
