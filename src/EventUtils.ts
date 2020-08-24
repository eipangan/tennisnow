import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Event, EventType, Match, Player } from './models';
import { deletePlayer, savePlayer } from './PlayerUtils';

// initialize dayjs
dayjs.extend(calendar);

/**
 * delete event from DataStore
 *
 * @param event
 */
export const deleteEvent = async (event: Event): Promise<void> => {
  await DataStore.delete(event);
};

/**
 * get events from DataStore
 *
 * @param eventID
 */
export const getEvents = async (): Promise<Event[]> => {
  const fetchedEvents = await DataStore.query(Event);
  return fetchedEvents;
};

/**
 * get matches from DataStore, given an eventID
 *
 * @param eventID
 */
export const getMatches = async (eventID: string): Promise<Match[]> => {
  const fetchedMatches = await DataStore.query(Match, (m) => m.eventID('eq', eventID));
  return fetchedMatches;
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
 * get new event
 */
export const getNewEvent = (): Event => {
  const newEvent = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    type: EventType.GENERIC_EVENT,
  });

  return newEvent;
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
 * save event
 *
 * @param event
 */
export const saveEvent = async (event: Event): Promise<void> => {
  await DataStore.save(event);
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
