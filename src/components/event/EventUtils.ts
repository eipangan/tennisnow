import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Event, Match } from '../../models';
import { getMatches } from '../match/MatchUtils';
import getPlayers from '../player/PlayerUtils';
import getTeams from '../team/TeamUtils';

// initialize dayjs
dayjs.extend(calendar);

/**
 * getNewEvent
 */
export const getNewEvent = (): Event => {
  const defaultNumPlayers = 6;

  const players = getPlayers(defaultNumPlayers);
  const teams = getTeams(players);
  const matches = getMatches(teams);

  return new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    numPlayers: defaultNumPlayers,
    players,
    teams,
    matches,
  });
};

/**
 * getNextMatch
 *
 * @param event
 */
export const getNextMatch = (event: Event): Match => event.matches[0];
