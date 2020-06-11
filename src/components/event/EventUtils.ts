import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Event, Match, MatchStatus, Player } from '../../models';

// initialize dayjs
dayjs.extend(calendar);

/**
 * getNewEvent
 */
export const getNewEvent = (): Event => {
  const event = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
  });

  return event;
};

/**
 * getNextMatch
 *
 * @param event
 */
export const getNextMatch = (event: Event): Match | undefined => {
  let nextMatch: Match | undefined;
  if (event.matches) {
    nextMatch = new Match({
      eventID: event.id,
      status: MatchStatus.NEW,
    });
  }
  return nextMatch;
};

export const getPlayers = (
  event: Event,
  numPlayers: number,
  playerNames?: string[],
): Player[] | undefined => {
  let players: Player[] | undefined;
  if (event.players) {
    players = [];
    for (let i = 0; i < numPlayers; i += 1) {
      players.push(new Player({
        eventID: event.id,
        index: i,
        name: playerNames ? playerNames[i] : '',
      }));
    }
  }

  return players;
};

/**
 * saveEvent
 *
 * @param myEvent
 */
export const saveEvent = async (myEvent: Event) => {
  await DataStore.save(myEvent);
};
