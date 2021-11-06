import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, { useEffect, useState } from 'react';
import MatchesPanel from './MatchesPanel';
import { Event, Match } from './models';

// initialize dayjs
dayjs.extend(calendar);

type EventPanelProps = {
  event: Event | undefined,
}

const EventPanel = (props: EventPanelProps) => {
  const { event } = props;
  const [matches, setMatches] = useState<Match[]>([]);

  // whenever event change, re-fetch/re-initalize matches
  useEffect(() => {
    if (!event) return () => { };

    let mounted = true;
    const fetchMatches = async (eid: string) => {
      const fetchedMatches = await DataStore.query(Match, (m) => m.eventID('eq', eid));
      if (mounted) {
        setMatches(fetchedMatches);
      }
    };

    fetchMatches(event.id);
    const subscription = DataStore.observe(Match,
      (m) => m.eventID('eq', event.id))
      .subscribe(() => {
        fetchMatches(event.id);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [event]);

  return (
    <div>
      <MatchesPanel
        event={event}
        matches={matches}
      />
    </div>
  );
};

export default EventPanel;
