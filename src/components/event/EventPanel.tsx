import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { DataStore } from 'aws-amplify';
import { Event, Match } from '../../models';
import MatchesList from '../match/MatchesList';
import PlayersSummary from '../player/PlayersSummary';
import { ThemeType } from '../utils/Theme';

// initialize dayjs
dayjs.extend(calendar);

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  event: {
    background: 'transparent',
  },
  eventHeader: {
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

  const saveEvent = async (myEvent: Event) => {
    await DataStore.save(myEvent);
  };

  return (
    <div className={classes.event}>
      {dayjs(event.date).calendar()}
      <MatchesList
        matches={event.matches || []}
        players={event.players || []}
        onUpdate={(matches: Match[]) => {
          saveEvent(Event.copyOf(event, (updatedEvent) => {
            updatedEvent.matches = matches;
          }));
        }}
      />
      <div className={classes.eventPlayersSummary}>
        <PlayersSummary event={event} />
      </div>
    </div>
  );
};

export default EventPanel;
