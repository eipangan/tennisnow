import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, { useEffect, useState } from 'react';
import MatchesPanel from './MatchesPanel';
import { Event, Match, Player } from './models';
import { getPlayers } from './utils/EventUtils';

// initialize dayjs
dayjs.extend(calendar);

type EventPanelProps = {
  event: Event | undefined,
}

const EventPanel = (props: EventPanelProps) => {
  const { event } = props;
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

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
    return () => {
      mounted = false;
    };
  }, [event]);

  // whenever event change, re-fetch/re-initalize players
  useEffect(() => {
    if (!event) return () => { };

    let mounted = true;
    const fetchPlayers = async (eid: string) => {
      const fetchedPlayers = await getPlayers(eid);
      if (mounted) {
        setPlayers(fetchedPlayers);
      }
    };

    fetchPlayers(event.id);
    return () => {
      mounted = false;
    };
  }, [event]);

  return (
    <div>
      <MatchesPanel
        event={event}
        matches={matches}
        players={players}
      />
    </div>
  );
};

export default EventPanel;
