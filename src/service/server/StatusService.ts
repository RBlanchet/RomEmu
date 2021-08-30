import {injectable} from "inversify";
import WebServer from "../../server/WebServer";
import Auth from "../../server/Auth";
import World from "../../server/World";

@injectable()
export default class StatusService {
  public static sendStatus(): void {
    WebServer.getSocket().emit('status', {
      api: WebServer.isApiOpen,
      socket: WebServer.isSocketOpen,
      auth: Auth.isAuthOpen,
      world: World.isWorldOpen,
    });
  }
}
