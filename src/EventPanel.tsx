import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import MatchesPanel from './MatchesPanel';
import { Event, Match, Player } from './models';
import PlayersSummary from './PlayersSummary';

// initialize dayjs
dayjs.extend(calendar);

type EventPanelProps = {
  event: Event | undefined,
  matches: Match[],
  players: Player[],
}

const EventPanel = (props: EventPanelProps) => {
  const { event, matches, players } = props;

  return (
    <div>
      <MatchesPanel
        matches={matches}
        players={players}
      />
      <PlayersSummary
        matches={matches}
        players={players}
      />
    </div>
  );
};

export default EventPanel;
