import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, { useContext } from 'react';
import { EventContext } from './EventContext';
import MatchesPanel from './MatchesPanel';
import PlayersSummary from './PlayersSummary';

// initialize dayjs
dayjs.extend(calendar);

/**
 * EventPanel
 */
const EventPanel = () => {
  const { event } = useContext(EventContext);

  if (!event) return <></>;
  return (
    <div>
      <MatchesPanel />
      <PlayersSummary />
    </div>
  );
};

export default EventPanel;
