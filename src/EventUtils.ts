import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Event, EventType, Match, MatchStatus, Player } from './models';
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
 * get event from DataStore, given an eventID
 *
 * @param eventID
 */
export const getEvent = async (eventID: string): Promise<Event> => {
  const fetchedEvent = await DataStore.query(Event, eventID);
  return fetchedEvent;
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
 * get match from DataStore, given a matchID
 *
 * @param matchID
 */
export const getMatch = async (matchID: string): Promise<Match> => {
  const fetchedMatch = await DataStore.query(Match, matchID);
  return fetchedMatch;
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
  const fetchedPlayers = await DataStore.query(Player, (p) => p.eventID('eq', eventID));
  return fetchedPlayers.sort((a, b) => a.index - b.index);
};

/**
 * get new event
 */
export const getNewEvent = (): Event => {
  const event = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    type: EventType.GENERIC_EVENT,
  });

  return event;
};

/**
 * get next match
 *
 * @param eventID
 * @param matches
 * @param players
 */
export const getNextMatch = async (
  event: Event,
  matches: Match[] | undefined = undefined,
  players: Player[] | undefined = undefined,
): Promise<Match | undefined> => {
  const myMatches = matches || await getMatches(event.id);
  const myPlayers = players || await getPlayers(event.id);

  let nextMatch: Match | undefined;

  /**
   * get potential players
   */
  const getPotentialPlayers = () => {
    // calculate number of matches played
    const numPlayed = myPlayers.map(() => 0);
    myMatches.forEach((myMatch) => {
      if (myMatch.playerIndices) {
        myMatch.playerIndices.forEach((playerIndex) => {
          numPlayed[playerIndex] += 1;
        });
      }
    });

    // get potential players
    const potentialPlayers: number[] = [];
    for (let i = 0; i <= myMatches.length; i += 1) {
      myPlayers.forEach((player) => {
        if (numPlayed[player.index] === i) {
          potentialPlayers.push(player.index);
        }
      });
    }

    // return potential players
    return potentialPlayers;
  };

  /**
   * get potential matches
   */
  const getPotentialMatches = () => {
    const allMatches = myPlayers.flatMap((v, i) => myPlayers.slice(i + 1).map((w) => ([v.index, w.index])));
    const allMatchesDone = myMatches.map((m) => {
      if (!m.playerIndices) return undefined;
      return ([m.playerIndices[0], m.playerIndices[1]]);
    });
    return allMatches.filter((m) => JSON.stringify(allMatchesDone).indexOf(JSON.stringify(m)) === -1);
  };

  // get next match
  const potentialPlayers = getPotentialPlayers();
  const potentialMatches = getPotentialMatches();
  const BreakException = {};
  try {
    const eventID = event.id;
    potentialPlayers.forEach((p1) => {
      potentialPlayers.forEach((p2) => {
        if (JSON.stringify(potentialMatches).indexOf(JSON.stringify([p1, p2])) !== -1) {
          nextMatch = new Match({
            eventID,
            createdTime: dayjs().toDate().toISOString(),
            playerIndices: [p1, p2],
            status: MatchStatus.NEW,
          });
          throw BreakException;
        }
      });
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }

  // console.log(potentialPlayers, potentialMatches, event.type, nextMatch);

  return nextMatch;
};

/**
 * get new players
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
  for (let i = 0; i < numPlayers; i += 1) {
    newPlayers.push(new Player({
      eventID,
      index: i,
      name: playerNames[i] || '',
    }));
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
  const toRemovePlayers = currentPlayers.filter((p) => JSON.stringify(players).indexOf(JSON.stringify(p)) === -1);
  toRemovePlayers.forEach((player) => deletePlayer(player));

  // save new players
  players.forEach((player) => savePlayer(player));
};
