import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { DataStore } from 'aws-amplify';
import { Event, Match, MatchStatus } from '../../models';
import { getPlayers } from '../player/PlayerUtils';

// initialize dayjs
dayjs.extend(calendar);

/**
 * getNewEvent
 */
export const getNewEvent = (): Event => {
  const defaultNumPlayers = 6;

  const players = getPlayers(defaultNumPlayers);
  const event = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    players,
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
  const { id, players, matches } = event;

  if (matches) {
    const playerIndices: number[] = [];
    if (players) players.map((player) => playerIndices.push(player.index));

    nextMatch = new Match({
      eventID: id,
      playerIndices,
      status: MatchStatus.NEW,
    });
  }
  return nextMatch;
};

/**
 * saveEvent
 *
 * @param myEvent
 */
export const saveEvent = async (myEvent: Event) => {
  await DataStore.save(myEvent);
};
