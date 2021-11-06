import dayjs from 'dayjs';
import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import MatchPanel from './MatchPanel';
import { Event, Match, Player } from './models';
import { ThemeType } from './Theme';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  matchesPanel: {
    background: theme.highlightColor,
    border: '1px solid lightgray',
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'scroll',
    padding: '9px 15px',
  },
  buttonsPanel: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px 15px 0px 0px',
  },
  matchPanel: {
    margin: '0px 4px',
  },
}));

type MatchesPanelProps = {
  event: Event | undefined,
  matches: Match[],
  players: Player[],
}

const MatchesPanel = (props: MatchesPanelProps) => {
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });

  const { event, matches, players } = props;

  const MatchesList = () => (
    <>
      {
        matches
          .sort((a: Match, b: Match) => (dayjs(a.createdTime).isBefore(dayjs(b.createdTime)) ? -1 : 1))
          .map((match, index) => (
            <div
              className={classes.matchPanel}
              key={index.toString()}
            >
              <MatchPanel
                match={match}
                players={players}
              />
            </div>
          ))
      }
    </>
  );

  return (
    <div className={classes.matchesPanel}>
      <MatchesList />
    </div>
  );
};

export default MatchesPanel;
