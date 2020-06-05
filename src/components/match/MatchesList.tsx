import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { ThemeType } from '../utils/Theme';
import MatchPanel from './MatchPanel';
import { Match } from '../../models';

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
  onUpdate?: () => void;
}

/**
 * MatchesList Component
 *
 * @param props
 */
const MatchesList = (props: MatchesListProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { matches, onUpdate } = props;

  return (
    <div className={classes.matchesPanel}>
      <RightOutlined />
      {matches.map((match, index) => (
        <MatchPanel
          key={index.toString()}
          match={match}
          onUpdate={onUpdate}
        />
      ))}
      <LeftOutlined />
    </div>
  );
};

export default MatchesList;
