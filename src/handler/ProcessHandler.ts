import Packet from "../model/Packet";
import * as Messages from "./../network/ankamagames/dofus/Messages";
import AuthController from "../controller/AuthController";
import {container} from "../inversify.config";

export default class ProcessHandler {
  public static handle(packet: Packet) {
    const messagesHandler = [
      {message: Messages.IdentificationMessage, controller: AuthController, method: 'login'},
    ];

    const handler = messagesHandler.find(m => m.message.messageId === packet.getMessage().messageId);

    if (handler) {
      const resolver = container.resolve(handler.controller);
      resolver[handler.method](packet);
    }
  }
}
