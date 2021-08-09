import {Get, Post, JsonController, Param} from "routing-controllers";
import {injectable} from "inversify";
import WebServer from "../../server/web";
import Auth from "../../server/auth";

@injectable()
@JsonController("/instances")
export default class InstanceController {
  @Get("/status")
  getAll() {
    return {
      auth: false,
      world: false,
      api: WebServer.isApiOpen,
      socket: WebServer.isSocketOpen,
    };
  }

  @Post("/start/:server")
  startServer(@Param('server') server: string) {
    switch (server) {
      case 'auth':
        Auth.start();
    }

    return [];
  }
}
