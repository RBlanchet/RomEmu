import net from "net";
import WebServer from "../server/web";
import PacketMessenger from "../messenger/PacketMessenger";
import * as Messages from './../network/ankamagames/dofus/Messages';
import PacketFactory from "../factory/PacketFactory";
import {v4 as uuidv4} from 'uuid';
import ProcessHandler from "../handler/ProcessHandler";

export default class Client {
  private readonly socket: net.Socket;
  private readonly uid: Number;

  constructor(
    socket: net.Socket
  ) {
    this.socket = socket;
    this.receive();
    this.uid = uuidv4();

    this.send(new Messages.ProtocolRequiredMessage(1738, 1738));
    this.send(new Messages.HelloConnectMessage("ivu9wh58^kQQw*8n:jud11Kw(bHY9m3V", 303));
  }

  private receive(): void {
    WebServer.emit('auth', {type: 'network', message: 'Une nouvelle instance est connecté'});
    this.socket.on('data', (data) => {
      ProcessHandler.handle(PacketFactory.create(data, this));
    });

    this.socket.on('end', (data) => {
      WebServer.emit('auth', {type: 'network', message: 'Une instance s\'est déconnecté'});
    })
  }

  public send(message: Messages): void {
    PacketMessenger.send(message, this);
  }

  public getSocket(): net.Socket
  {
    return this.socket;
  }

  public getUid(): Number
  {
    return this.uid;
  }
}
