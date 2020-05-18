import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { AppContext } from '../../App';
import Match, { getMatches, getOrderedMatches, MatchType } from '../match/Match';
import { getPlayers, PlayerType } from '../player/Player';
import PlayersSummary from '../player/PlayersSummary';
import { getTeams, TeamType } from '../team/Team';
import { ThemeType } from '../utils/Theme';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  event: {
    background: 'transparent',
  },
  eventHeader: {
    background: 'transparent',
  },
  eventMatches: {
    alignItems: 'center',
    background: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'scroll',
    padding: {
      top: '9px',
      bottom: '12px',
    },
  },
  eventPlayersSummary: {
    background: 'transparent',
  },
}));

/**
 * EventType
 */
export interface EventType {
  eventID: string | undefined;
  date: Date;
  numPlayers: number;
  players: PlayerType[];
  teams: TeamType[];
  matches: MatchType[];
  orderedMatches: MatchType[];
}

/**
 * getEvent
 */
export const getNewEvent = (): EventType => {
  const defaultNumPlayers = 6;

  const numPlayers = defaultNumPlayers;
  const players = getPlayers(numPlayers);
  const teams = getTeams(players);
  const matches = getMatches(teams);
  const orderedMatches = getOrderedMatches(players, teams, matches);

  return {
    eventID: undefined,
    date: dayjs().add(1, 'hour').startOf('hour').toDate(),
    numPlayers,
    players,
    teams,
    matches,
    orderedMatches,
  };
};

/**
 * Event
 *
 * @param props
 */
const Event = (): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { event, setEvent } = useContext(AppContext);

  return (
    <div className={classes.event}>
      <div className={classes.eventMatches}>
        <RightOutlined />
        {event.orderedMatches && event.orderedMatches.map((match: MatchType) => (
          <div key={match.matchID}>
            <Match
              match={match}
              onUpdate={() => {
                if (event) {
                  setEvent({ ...event });
                }
              }}
            />
          </div>
        ))}
        <LeftOutlined />
      </div>
      <div className={classes.eventPlayersSummary}>
        <PlayersSummary />
      </div>
    </div>
  );
};

export default Event;
