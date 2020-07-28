import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import MatchesList from './MatchesList';
import { Event, EventType } from './models';
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
 * EventPanelProps
 */
type EventPanelProps = {
  event: Event;
}

/**
 * EventPanel
 *
 * @param props
 */
const EventPanel = (props: EventPanelProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { event } = props;
  const eventID = event.id;
  const eventType = event.type;

  const EventMatchesList = () => {
    if (event && eventType === EventType.GENERIC_EVENT) return <></>;
    return (
      <MatchesList eventID={eventID} />
    );
  };

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
        <PlayersSummary eventID={event.id} />
      </div>
    </div>
  );
};

export default EventPanel;
