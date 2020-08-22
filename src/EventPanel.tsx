import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, { useContext } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { EventContext } from './EventContext';
import MatchesList from './MatchesList';
import { EventType } from './models';
import PlayersSummary from './PlayersSummary';
import { ThemeType } from './Theme';

// initialize dayjs
dayjs.extend(calendar);

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  eventPanel: {
    background: 'transparent',
  },
  eventSummary: {
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
const EventPanel = (): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { event } = useContext(EventContext);

  const EventMatchesList = () => {
    if (event && event.type === EventType.GENERIC_EVENT) return <></>;
    return <MatchesList />;
  };

  if (!event) return <></>;
  return (
    <div className={classes.eventPanel}>
      <div className={classes.eventSummary}>
        <strong>{dayjs(event.date).calendar()}</strong>
        <br />
        {event.summary}
      </div>
      <div className={classes.eventMatches}>
        <EventMatchesList />
      </div>
      <div className={classes.eventPlayersSummary}>
        <PlayersSummary />
      </div>
    </div>
  );
};

export default EventPanel;
