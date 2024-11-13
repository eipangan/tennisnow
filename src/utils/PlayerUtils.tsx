import { DataStore } from '@aws-amplify/datastore';
import { Player } from '../models';

/**
 * delete player
 *
 * @param player
 */
export const deletePlayer = async (player: Player) => {
  await DataStore.delete(player);
};

/**
 * get player name
 *
 * @param player
 */
export const getPlayerName = (player: Player | Player[], maxLength: number = Number.MAX_VALUE): string | undefined => {
  if (!player) return undefined;

  if (Array.isArray(player)) {
    const playerName: string[] = [];
    player.forEach((p) => {
      if (p.name) {
        playerName.push(p.name.substring(0, maxLength));
      }
    });
    return playerName.join('・');
  }

  if (!Array.isArray(player) && player.name) {
    return player.name.substring(0, maxLength);
  }

  return undefined;
};
