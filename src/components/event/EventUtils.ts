import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Event, Match, MatchStatus, Player } from '../../models';

// initialize dayjs
dayjs.extend(calendar);

/**
 * delete event
 *
 * @param myEvent
 */
export const deleteEvent = async (myEvent: Event) => {
  await DataStore.delete(myEvent);
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
 * @param event
 */
export const getNextMatch = (
  eventID: string,
  players: Player[] = [],
  matches: Match[] = [],
): Match | undefined => {
  if (players.length < 2) return undefined;

  // initialize numPlayed array
  const numPlayed = players.map(() => 0);
  matches.forEach((match) => {
    if (match.playerIndices) {
      match.playerIndices.forEach((playerIndex) => {
        numPlayed[playerIndex] += 1;
      });
    }
  });

  // initialize next players
  const nextPlayerIndices: number[] = [];
  for (let i = 0; i < players.length; i += 1) {
    players.forEach((player) => {
      if (numPlayed[player.index] === i) {
        nextPlayerIndices.push(player.index);
      }
    });
  }

  // build nextMatch
  const maxPlayerIndicex = 2;
  const nextMatch = new Match({
    eventID,
    playerIndices: nextPlayerIndices.slice(0, maxPlayerIndicex),
    status: MatchStatus.NEW,
  });

  return nextMatch;
};

/**
 * get players
 *
 * @param event
 * @param numPlayers
 * @param playerNames
 */
export const getPlayers = (
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
 * @param myEvent
 */
export const saveEvent = async (myEvent: Event) => {
  await DataStore.save(myEvent);
};
