import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Event, Match, MatchStatus, Player } from '../../models';
import { getPlayers } from '../player/PlayerUtils';

// initialize dayjs
dayjs.extend(calendar);

/**
 * getNextMatch
 *
 * @param event
 */
export const getNextMatch = (players: Player[], matches: Match[]): Match => {
  const playerIndices : number[] = [];
  players.map((player) => playerIndices.push(player.index));

  return new Match({
    playerIndices,
    status: MatchStatus.NEW,
  });
};

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
    matches: [getNextMatch(players, [])],
  });

  return event;
};
