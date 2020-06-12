import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Event, Match, MatchStatus, Player } from '../../models';

// initialize dayjs
dayjs.extend(calendar);

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
  playerNames?: string[],
): Player[] | undefined => {
  const players: Player[] = [];
  for (let i = 0; i < numPlayers; i += 1) {
    players.push(new Player({
      eventID,
      index: i,
      name: playerNames ? playerNames[i] || '' : '',
    }));
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
