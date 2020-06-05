import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { Event } from '../../models';
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
  onUpdate?: () => void;
}

/**
 * EventPanel
 *
 * @param props
 */
const EventPanel = (props: EventPanelProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { event, onUpdate } = props;

  return (
    <div className={classes.event}>
      {dayjs(event.date).calendar()}
      <MatchesList
        matches={event.matches}
        onUpdate={onUpdate}
      />
      <div className={classes.eventPlayersSummary}>
        <PlayersSummary event={event} />
      </div>
    </div>
  );
};

export default EventPanel;
