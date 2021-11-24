import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import MatchPanel from './MatchPanel';
import { Match, Player } from './models';
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
  matches: Match[],
  fetchMatches: (eventID: string) => void;
  players: Player[],
}

const MatchesPanel = (props: MatchesPanelProps) => {
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });

  const { matches, players, fetchMatches } = props;

  return (
    <div className={classes.matchesPanel}>
      {
        matches
          .sort((a: Match, b: Match) => (a.orderID < b.orderID ? -1 : 1))
          .map((match, index) => (
            <div
              className={classes.matchPanel}
              key={index.toString()}
            >
              <MatchPanel
                match={match}
                fetchMatches={fetchMatches}
                players={players}
              />
            </div>
          ))
      }
    </div>
  );
};

export default MatchesPanel;
