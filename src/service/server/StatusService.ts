import {injectable} from "inversify";
import WebServer from "../../server/web";
import Auth from "../../server/auth";

@injectable()
export default class StatusService {
  public static sendStatus(): void {
    WebServer.getSocket().emit('status', {
      api: WebServer.isApiOpen,
      socket: WebServer.isSocketOpen,
      auth: Auth.isAuthOpen,
      world: false,
    });
  }
}
