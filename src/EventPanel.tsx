import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, { useContext } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { EventContext } from './EventContext';
import MatchesList from './MatchesList';
import PlayersSummary from './PlayersSummary';
import { ThemeType } from './Theme';

// initialize dayjs
dayjs.extend(calendar);

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  eventPanel: {
    background: 'transparent',
  },
  eventMatches: {
    background: 'transparent',
  },
  eventPlayersSummary: {
    background: 'transparent',
  },
}));

/**
 * EventPanel
 */
const EventPanel = () => {
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });

  const { event } = useContext(EventContext);

  if (!event) return <></>;
  return (
    <div className={classes.eventPanel}>
      <div className={classes.eventMatches}>
        <MatchesList />
      </div>
      <div className={classes.eventPlayersSummary}>
        <PlayersSummary />
      </div>
    </div>
  );
};

export default EventPanel;
