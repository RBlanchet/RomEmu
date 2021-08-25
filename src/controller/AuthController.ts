import {injectable} from "inversify";
import Packet from "../model/Packet";
import AccountRepository from "../repository/account.repository";
import {getCustomRepository} from "typeorm";
import {
  IdentificationFailedMessage,
  IdentificationSuccessMessage,
  ServersListMessage
} from "../network/ankamagames/dofus/Messages";
import {GameServerInformations} from "../network/ankamagames/dofus/Types";


@injectable()
export default class AuthController {
  private readonly accountRepository: AccountRepository = getCustomRepository(AccountRepository);

  public async login(packet: Packet) {
    // Définition du password et du nom d'utilisateur
    const username: string = packet.getMessage().lang.split('@')[0];
    const password: string = packet.getMessage().lang.split('@')[1];

    // Nous allons chercher un compte possèdant ces logs en base
    try {
      const account = await this.accountRepository.findByUsernameAndPassword(username,  password);

      if (account) {
        if (!account.locked) {
          // Authentification réussie, envoie du message de succès
          packet.getClient().send(new IdentificationSuccessMessage(
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
          packet.getClient().send(new ServersListMessage(
            [new GameServerInformations(1, 1, 3, 0, true, 0, 1),],
            0,
            true)
          );
        } else {
          packet.getClient().send(new IdentificationFailedMessage(3));
        }
      } else {
        packet.getClient().send(new IdentificationFailedMessage(2));
      }
    } catch (e) {
      console.error(e);
    }
  }
}
