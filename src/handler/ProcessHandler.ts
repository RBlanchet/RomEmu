import Packet from "../model/Packet";
import * as Messages from "./../network/ankamagames/dofus/Messages";
import AuthController from "../controller/AuthController";
import {container} from "../inversify.config";

export default class ProcessHandler {
  public static handle(packet: Packet) {
    const messagesHandler = [
      {message: Messages.IdentificationMessage, controller: AuthController, method: 'login'},
      {message: Messages.ServerSelectionMessage, controller: AuthController, method: 'selectServer'},
      {message: Messages.AuthenticationTicketMessage, controller: AuthController, method: 'identifyClient'},
    ];

    const handler = messagesHandler.find(m => m.message.messageId === packet.message.messageId);

    if (handler) {
      const resolver = container.resolve(handler.controller);
      // @ts-ignore
      resolver[handler.method](packet);
    } else {
      throw new Error(`Impossible de trouver une correspondance dans le packet reçu (id: ${packet.message.messageId}`);
    }
  }
}
