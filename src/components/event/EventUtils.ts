import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Event, Match, MatchStatus, Player } from '../../models';
import { deletePlayer, savePlayer } from '../player/PlayerUtils';

// initialize dayjs
dayjs.extend(calendar);

/**
 * delete event
 *
 * @param event
 */
export const deleteEvent = async (event: Event) => {
  await DataStore.delete(event);
};

/**
 * get new event
 */
export const getNewEvent = (): Event => {
  const event = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
  });

  return event;
};

/**
 * get next match or undefined if cannot get next match
 *
 * @param eventID
 * @param players
 * @param matches
 */
export const getNextMatch = (
  eventID: string,
  players: Player[] = [],
  matches: Match[] = [],
): Match | undefined => {
  if (players.length < 2) return undefined;

  // get potential players
  const getPotentialPlayers = () => {
    const numPlayed = players.map(() => 0);
    matches.forEach((myMatch) => {
      if (myMatch.playerIndices) {
        myMatch.playerIndices.forEach((playerIndex) => {
          numPlayed[playerIndex] += 1;
        });
      }
    });

    const potentialPlayers: number[] = [];
    for (let i = 0; i < players.length; i += 1) {
      players.forEach((player) => {
        if (numPlayed[player.index] === i) {
          potentialPlayers.push(player.index);
        }
      });
    }

    return potentialPlayers;
  };

  // get potential matches
  const getPotentialMatches = () => {
    const allMatches = players.flatMap((v, i) => players.slice(i + 1).map((w) => ([v.index, w.index])));
    const allMatchesDone = matches.map((m) => {
      if (!m.playerIndices) return undefined;
      return ([m.playerIndices[0], m.playerIndices[1]]);
    });
    return allMatches.filter((m) => JSON.stringify(allMatchesDone).indexOf(JSON.stringify(m)) === -1);
  };

  const potentialPlayers = getPotentialPlayers();
  const potentialMatches = getPotentialMatches();

  const BreakException = {};
  let nextMatch: Match | undefined;
  try {
    potentialPlayers.forEach((p1) => {
      // eslint-disable-next-line consistent-return
      potentialPlayers.forEach((p2) => {
        if (JSON.stringify(potentialMatches).indexOf(JSON.stringify([p1, p2])) !== -1) {
          nextMatch = new Match({
            eventID,
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

  return nextMatch;
};

/**
 * get players
 *
 * @param eventID
 * @param numPlayers
 * @param playerNames
 */
export const getNewPlayers = (
  eventID: string,
  numPlayers: number = 6,
  playerNames: string[] = [],
): Player[] | undefined => {
  const players: Player[] = [];
  for (let i = 0; i < numPlayers; i += 1) {
    players.push(new Player({
      eventID,
      index: i,
      name: playerNames[i] || '',
    }));
  }

  return players;
};

/**
 * save event
 *
 * @param event
 */
export const saveEvent = async (event: Event) => {
  await DataStore.save(event);
};

/**
 * save players for an event
 *
 * @param eventID id of the event
 * @param players players
 */
export const savePlayers = async (eventID: string, players: Player[]) => {
  const currentPlayers = await DataStore.query(Player, (p) => p.eventID('eq', eventID));

  // remove unneeded players
  const toRemovePlayers = currentPlayers.filter((p) => JSON.stringify(players).indexOf(JSON.stringify(p)) === -1);
  toRemovePlayers.forEach((player) => deletePlayer(player));

  // save new players
  players.forEach((player) => savePlayer(player));
};
