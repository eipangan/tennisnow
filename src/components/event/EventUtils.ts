import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Event, Match, Player } from '../../models';
import { getPlayers } from '../player/PlayerUtils';
import getMatches from '../match/MatchUtils';
import getTeams from '../team/TeamUtils';

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
    teams: [],
    matches: [],
  });
};

/**
 * getNextMatch
 * TODO: need to update this function to actually get the next match
 *
 * @param event
 */
export const getNextMatch = (players: Player[], matches: Match[]): Match => {
  // get potential 4 players

  // get potential 2 teams
  const teams = getTeams(players);

  // get potential match
  return getMatches(teams)[0];
};
