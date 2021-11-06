import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React from 'react';
import MatchesPanel from './MatchesPanel';
import { Event } from './models';

// initialize dayjs
dayjs.extend(calendar);

type EventPanelProps = {
  event: Event | undefined,
}

const EventPanel = (props: EventPanelProps) => {
  const { event } = props;

  return (
    <div>
      <MatchesPanel event={event} />
    </div>
  );
};

export default EventPanel;
