import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, { useEffect, useState } from 'react';
import MatchesPanel from './MatchesPanel';
import { Event, Match, Player } from './models';
import PlayersSummary from './PlayersSummary';

// initialize dayjs
dayjs.extend(calendar);

type EventPanelProps = {
  event: Event | undefined,
}

const EventPanel = (props: EventPanelProps) => {
  const { event } = props;
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  // initalize matches
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id]);

  // initialize players
  useEffect(() => {
    if (!event) return () => { };

    let mounted = true;
    const fetchPlayers = async (eid: string) => {
      const fetchedPlayers = await DataStore.query(Player, (p) => p.eventID('eq', eid));
      if (mounted) {
        setPlayers(fetchedPlayers);
      }
    };

    fetchPlayers(event.id);
    const subscription = DataStore.observe(Player,
      (p) => p.eventID('eq', event.id))
      .subscribe(() => {
        fetchPlayers(event.id);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id]);

  return (
    <div>
      <MatchesPanel
        matches={matches}
      />
      <PlayersSummary
        matches={matches}
        players={players}
      />
    </div>
  );
};

export default EventPanel;
