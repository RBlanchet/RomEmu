import {injectable} from "inversify";
import Packet from "../model/Packet";
import AccountRepository from "../repository/AccountRepository";
import {getCustomRepository} from "typeorm";
import {
  AccountCapabilitiesMessage,
  AuthenticationTicketAcceptedMessage,
  IdentificationFailedMessage,
  IdentificationSuccessMessage, SelectedServerDataMessage, ServerOptionalFeaturesMessage, ServerSettingsMessage,
  ServersListMessage, SystemMessageDisplayMessage, TrustStatusMessage
} from "../network/ankamagames/dofus/Messages";
import {GameServerInformations} from "../network/ankamagames/dofus/Types";
import Auth from "../server/Auth";


@injectable()
export default class AuthController {
  private readonly accountRepository: AccountRepository = getCustomRepository(AccountRepository);

  public async login(packet: Packet): Promise<void> {
    // @ts-ignore Définition du password et du nom d'utilisateur
    const username: string = packet.message.lang.split('@')[0];
    // @ts-ignore
    const password: string = packet.message.lang.split('@')[1];

    // Nous allons chercher un compte possèdant ces logs en base
    try {
      const account = await this.accountRepository.findByUsernameAndPassword(username, password);

      if (Auth.getClientByAccount(account)) {
        await Auth.getClientByAccount(account)?.send(new SystemMessageDisplayMessage(
          true,
          61,
          [`Votre connexion s'est interrompue, un autre utilisateur s'est connecté.`],
        ));
        await Auth.getClientByAccount(account)?.socket.end();
      }

      // On définit au client le compte
      packet.client.account = account;

      if (account) {
        if (!account.locked) {
          // Authentification réussie, envoie du message de succès
          packet.client.send(new IdentificationSuccessMessage(
            account.username,
            account.nickname,
            account.uid,
            0,
            true,
            account.secretQuestion,
            0,
            1,
            0,
            0,
            5
          ));
          // On envoie aussi une liste de serveur, par défaut on va le mettre en dur, on pourra envisager une entité pour ça
          packet.client.send(new ServersListMessage(
            [new GameServerInformations(1, 1, 3, 0, true, 0, 1),],
            0,
            true)
          );
        } else {
          packet.client.send(new IdentificationFailedMessage(3));
        }
      } else {
        packet.client.send(new IdentificationFailedMessage(2));
      }
    } catch (e) {
      console.error(e);
    }
  }

  public async selectServer(packet: Packet): Promise<void> {
    packet.client.send(new SelectedServerDataMessage(
      // @ts-ignore
      1,
      '127.0.0.1',
      5555,
      true,
      packet.client.ticket,
    ));
    packet.client.socket.end();
  }

  public async identifyClient(packet: Packet): Promise<void> {
    // @ts-ignore
    packet.client.ticket = packet.message.ticket;
    // @ts-ignore
    packet.client.account = Auth.getClientByTicket(packet.client.ticket)?.account;

    if (!packet.client.ticket || !packet.client.account) {
      throw new Error('Le client ne possède pas de ticket d\'authentification ou de compte associé');
    }

    packet.client.send(new AuthenticationTicketAcceptedMessage());
    // @ts-ignore
    packet.client.send(new ServerSettingsMessage(packet.message.lang, 0, 0, 30));
    packet.client.send(new ServerOptionalFeaturesMessage([]));
    packet.client.send(new AccountCapabilitiesMessage(true, true, packet.client.account.uid, 131071, 131071, 0));
    packet.client.send(new TrustStatusMessage());
  }
}
