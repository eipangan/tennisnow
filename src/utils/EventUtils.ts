import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Event, Player } from '../models';
import { deletePlayer, savePlayer } from './PlayerUtils';

// initialize dayjs
dayjs.extend(calendar);

/**
 * save event to datastore
 *
 * @param event
 */
export const saveEvent = async (event: Event) => {
  await DataStore.save(event);
};

/**
 * get players from DataStore, given an eventID
 *
 * @param eventID
 */
export const getPlayers = async (eventID: string): Promise<Player[]> => {
  let players: Player[] = [];
  const fetchedPlayers = await DataStore.query(Player, (p) => p.eventID('eq', eventID));
  if (fetchedPlayers && Array.isArray(fetchedPlayers)) {
    players = fetchedPlayers.sort((a, b) => a.index - b.index);
  }

  return players;
};

/**
 * get new players, return array of players
 *
 * @param eventID
 * @param numPlayers
 * @param playerNames
 */
export const getNewPlayers = (
  eventID: string,
  numPlayers: number = 6,
  playerNames: string[] = [],
): Player[] => {
  const newPlayers: Player[] = [];
  if (eventID && eventID.length > 0) {
    for (let i = 0; i < numPlayers; i += 1) {
      newPlayers.push(new Player({
        eventID,
        index: i,
        name: playerNames[i] || '',
      }));
    }
  }

  return newPlayers;
};

/**
 * save players for an event
 *
 * @param eventID id of the event
 * @param players players
 */
export const savePlayers = async (
  eventID: string,
  players: Player[],
): Promise<void> => {
  const currentPlayers = await DataStore.query(Player, (p) => p.eventID('eq', eventID));

  // remove unneeded players
  if (currentPlayers && Array.isArray(currentPlayers)) {
    const toRemovePlayers = currentPlayers.filter((p) => JSON.stringify(players).indexOf(JSON.stringify(p)) === -1);
    toRemovePlayers.forEach((player) => deletePlayer(player));
  }

  // save new players
  players.forEach((player) => savePlayer(player));
};
