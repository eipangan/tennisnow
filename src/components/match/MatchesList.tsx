import { LeftOutlined, RightOutlined } from '@ant-design/icons';
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
    padding: {
      top: '9px',
      bottom: '12px',
    },
  },
}));

/**
 * MatchesListProps
 */
type MatchesListProps = {
  matches: Match[];
  players: Player[];
  onUpdate?: (matches: Match[]) => void;
}

/**
 * MatchesList Component
 *
 * @param props
 */
const MatchesList = (props: MatchesListProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { matches, players, onUpdate } = props;

  const getUpdatedMatches = (updatedMatch: Match): Match[] => {
    const updatedMatches: Match[] = [];

    matches.forEach((match) => {
      if (match.index === updatedMatch.index) {
        updatedMatches.push(updatedMatch);
      } else {
        updatedMatches.push(match);
      }
    });

    return updatedMatches;
  };

  return (
    <div className={classes.matchesPanel}>
      <RightOutlined />
      {matches.map((match, index) => (
        <MatchPanel
          key={index.toString()}
          match={match}
          players={players}
          onUpdate={(updatedMatch) => {
            if (onUpdate) {
              const updatedMatches = getUpdatedMatches(updatedMatch);
              onUpdate(updatedMatches);
            }
          }}
        />
      ))}
      <LeftOutlined />
    </div>
  );
};

export default MatchesList;
