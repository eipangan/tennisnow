import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { Match, Player } from '../../models';
import { ThemeType } from '../utils/Theme';
import MatchPanel from './MatchPanel';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  matchesPanel: {
    alignItems: 'center',
    background: theme.highlightColor,
    border: '1px solid lightgray',
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'scroll',
    padding: '9px 15px',
  },
}));

/**
 * MatchesListProps
 */
type MatchesListProps = {
  matches: Match[];
  players: Player[];
  extra?: JSX.Element;
}

/**
 * MatchesList Component
 *
 * @param props
 */
const MatchesList = (props: MatchesListProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { matches, players, extra } = props;

  return (
    <div className={classes.matchesPanel}>
      {matches.map((match, index) => (
        <MatchPanel
          key={index.toString()}
          match={match}
          players={players}
        />
      ))}
      <div style={{ padding: '0px 15px 0px 0px' }}>
        {extra}
      </div>
    </div>
  );
};

export default MatchesList;
