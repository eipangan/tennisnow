import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { ThemeType } from '../utils/Theme';
import Match, { MatchType } from './Match';

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
 * MatchesPanelProps
 */
type MatchesPanelProps = {
  data: MatchType[];
  onUpdate: () => void;
}

/**
 * MatchesPanel Component
 *
 * @param props
 */
const MatchesPanel = (props: MatchesPanelProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { data, onUpdate } = props;

  return (
    <div className={classes.matchesPanel}>
      <RightOutlined />
      {data.map((match: MatchType) => (
        <div key={match.matchID}>
          <Match
            match={match}
            onUpdate={onUpdate}
          />
        </div>
      ))}
      <LeftOutlined />
    </div>
  );
};

export default MatchesPanel;
