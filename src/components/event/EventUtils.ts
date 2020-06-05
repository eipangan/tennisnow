import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Event, Match, MatchStatus, Player } from '../../models';
import { getPlayers } from '../player/PlayerUtils';

// initialize dayjs
dayjs.extend(calendar);

/**
 * getNewEvent
 */
export const getNewEvent = (): Event => {
  const defaultNumPlayers = 6;

  const players = getPlayers(defaultNumPlayers);

  return new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    numPlayers: defaultNumPlayers,
    players,
    matches: [],
  });
};

/**
 * getNextMatch
 * TODO: need to update this function to actually get the next match
 *
 * @param event
 */
export const getNextMatch = (players: Player[], matches: Match[]): Match => (
  // get potential match
  new Match({
    players: [
      new Player({ index: 0, userid: [] }),
      new Player({ index: 2, userid: [] }),
    ],
    status: MatchStatus.NEW,
  })
);
