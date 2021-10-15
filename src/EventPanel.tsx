import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, { useContext } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { EventContext } from './EventContext';
import MatchesPanel from './MatchesPanel';
import PlayersSummary from './PlayersSummary';
import { ThemeType } from './Theme';

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
