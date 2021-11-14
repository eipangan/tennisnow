import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React from 'react';
import MatchesPanel from './MatchesPanel';
import { Event, Match, Player } from './models';
import PlayersSummary from './PlayersSummary';

// initialize dayjs
dayjs.extend(calendar);

type EventPanelProps = {
  event: Event | undefined,
  matches: Match[],
  fetchMatches: (eventID: string) => void;
  players: Player[],
}

const EventPanel = (props: EventPanelProps) => {
  const { event, matches, fetchMatches, players } = props;

  return (
    <div>
      <MatchesPanel
        matches={matches}
        fetchMatches={fetchMatches}
      />
      <PlayersSummary
        matches={matches}
        players={players}
      />
    </div>
  );
};

export default EventPanel;
