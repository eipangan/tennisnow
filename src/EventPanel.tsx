import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, { useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { getEvent } from './EventUtils';
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
  eventID: string;
}

/**
 * EventPanel
 *
 * @param props
 */
const EventPanel = (props: EventPanelProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { eventID } = props;

  const [event, setEvent] = useState<Event>();

  useEffect(() => {
    const fetchEvent = async (id: string) => {
      const fetchedEvent = await getEvent(id);
      setEvent(fetchedEvent);
    };

    fetchEvent(eventID);
    const subscription = DataStore.observe(Event, eventID)
      .subscribe(() => fetchEvent(eventID));
    return () => subscription.unsubscribe();
  }, [eventID]);

  const EventMatchesList = () => {
    if (event && event.type === EventType.GENERIC_EVENT) return <></>;
    return (
      <MatchesList eventID={eventID} />
    );
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
        <PlayersSummary eventID={event.id} />
      </div>
    </div>
  );
};

export default EventPanel;
