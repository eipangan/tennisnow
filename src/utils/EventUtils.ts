import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Event, EventType, Match, MatchStatus, Player } from '../models';
import { saveMatch } from './MatchUtils';
import { deletePlayer } from './PlayerUtils';

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

  // add new players
  players.forEach(async (player) => {
    await DataStore.save(player);
  });
};

export const saveMatches = async (
  event: Event,
  players: Player[],
): Promise<void> => {
  const matches: Record<EventType, Record<number, Array<number[]>>> = {
    GENERIC_EVENT: {

    },
    SINGLES_ROUND_ROBIN: {
      2: [[0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1]],
      3: [[0, 1], [0, 2], [1, 2], [0, 1], [0, 2], [1, 2], [0, 1], [0, 2], [1, 2], [0, 1], [0, 2], [1, 2]],
      4: [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [0, 1], [2, 3]],
      5: [[0, 1], [2, 3], [0, 4], [1, 3], [2, 4], [0, 1], [2, 3], [0, 4], [1, 3], [2, 4], [0, 1], [2, 3]],
      6: [[0, 1], [2, 3], [4, 5], [0, 3], [1, 5], [2, 4], [0, 5], [3, 4], [1, 2], [0, 4], [5, 2], [3, 1]],
      7: [[0, 1], [2, 3], [4, 5], [0, 6], [1, 3], [2, 5], [4, 6], [0, 3], [1, 5], [2, 6], [0, 4], [3, 5]],
      8: [[0, 1], [2, 3], [4, 5], [6, 7], [0, 3], [1, 5], [2, 7], [4, 6], [0, 5], [3, 7], [1, 6], [2, 4]],
    },
    FIX_DOUBLES_ROUND_ROBIN: {

    },
    DOUBLES_ROUND_ROBIN: {
      4: [[0, 1, 2, 3], [1, 2, 3, 0], [0, 2, 1, 3], [2, 0, 3, 1], [0, 3, 2, 1], [1, 0, 3, 2], [0, 1, 3, 2], [1, 3, 2, 0], [0, 3, 1, 2], [2, 1, 3, 0], [0, 2, 3, 1], [1, 0, 2, 3]],
      5: [[0, 1, 2, 3], [1, 2, 3, 4], [0, 2, 4, 1], [1, 3, 4, 0], [2, 4, 3, 0], [0, 3, 1, 4], [2, 0, 3, 1], [1, 0, 4, 2], [0, 4, 3, 2], [2, 1, 4, 3], [0, 1, 2, 4], [1, 2, 3, 0]],
      6: [[0, 1, 2, 3], [1, 2, 4, 5], [3, 4, 5, 0], [0, 2, 1, 4], [2, 4, 3, 5], [0, 3, 5, 1], [1, 3, 4, 0], [2, 5, 3, 0], [4, 1, 5, 2], [0, 4, 1, 5], [2, 0, 4, 3], [2, 1, 5, 3]],
      7: [[0, 1, 2, 3], [1, 4, 5, 6], [3, 0, 4, 2], [0, 5, 6, 1], [2, 5, 3, 4], [1, 2, 4, 6], [5, 3, 6, 0], [0, 2, 1, 5], [3, 6, 4, 0], [2, 6, 5, 4], [1, 3, 6, 2], [0, 3, 4, 1]],
      8: [[0, 1, 2, 3], [4, 5, 6, 7], [1, 2, 3, 4], [5, 6, 7, 0], [0, 2, 1, 4], [3, 6, 5, 7], [2, 4, 6, 0], [1, 5, 7, 3], [0, 3, 4, 6], [2, 5, 7, 1], [3, 1, 4, 0], [5, 0, 6, 2]],
    },
  };

  if (event.id && event.id.length > 0) {
    matches[event.type][players.length]?.forEach((value: number[], i: number) => {
      saveMatch(new Match({
        eventID: event.id,
        orderID: i,
        playerIndices: value,
        status: MatchStatus.NEW,
      }));
    });
  }
};
