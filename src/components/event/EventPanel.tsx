import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, { useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { Event, Match } from '../../models';
import MatchesList from '../match/MatchesList';
import { saveMatch } from '../match/MatchUtils';
import PlayersSummary from '../player/PlayersSummary';
import { ThemeType } from '../utils/Theme';
import { getNextMatch } from './EventUtils';

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
  const [matches, setMatches] = useState<Match[]>();

  useEffect(() => {
    const fetchMatches = async () => {
      const fetchedMatches = (await DataStore.query(Match)).filter((m) => m.eventID === event.id);
      if (fetchedMatches.length === 0) {
        const firstMatch = getNextMatch(event.id, event.players);
        if (firstMatch) {
          saveMatch(firstMatch);
          fetchedMatches.push(firstMatch);
        }
      }

      setMatches(fetchedMatches);
    };

    fetchMatches();
    const subscription = DataStore.observe(Match).subscribe(() => {
      fetchMatches();
    });
    return () => subscription.unsubscribe();
  }, [event.id, event.players]);

  return (
    <div className={classes.event}>
      {dayjs(event.date).calendar()}
      <MatchesList
        matches={matches || []}
        players={event.players || []}
      />
      <div className={classes.eventPlayersSummary}>
        <PlayersSummary event={event} />
      </div>
    </div>
  );
};

export default EventPanel;
