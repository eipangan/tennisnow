import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, { useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { getMatches, getNextMatch, getPlayers } from './EventUtils';
import MatchesList from './MatchesList';
import { deleteMatch, saveMatch } from './MatchUtils';
import { Event, EventType, Match, MatchStatus, Player } from './models';
import PlayersSummary from './PlayersSummary';
import { ThemeType } from './Theme';

// initialize dayjs
dayjs.extend(calendar);

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  eventPanel: {
    background: 'transparent',
  },
  eventSummary: {
    background: 'transparent',
  },
  eventMatches: {
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
  const [players, setPlayers] = useState<Player[]>();

  // update matches
  useEffect(() => {
    const fetchMatches = async () => {
      const fetchedMatches = await getMatches(event.id);
      setMatches(fetchedMatches);
    };

    fetchMatches();
    const subscription = DataStore.observe(Match,
      (m) => m.eventID('eq', event.id))
      .subscribe(() => fetchMatches());
    return () => subscription.unsubscribe();
  }, [event.id]);

  // update players
  useEffect(() => {
    const fetchPlayers = async () => {
      const fetchedPlayers = await getPlayers(event.id);
      setPlayers(fetchedPlayers);
    };

    fetchPlayers();
    const subscription = DataStore.observe(Player,
      (p) => p.eventID('eq', event.id))
      .subscribe(() => fetchPlayers());
    return () => subscription.unsubscribe();
  }, [event.id]);

  return (
    <div className={classes.eventPanel}>
      <div className={classes.eventSummary}>
        <strong>{dayjs(event.date).calendar()}</strong>
        <br />
        {event.summary}
      </div>
      <div className={classes.eventMatches}>
        <MatchesList
          matches={matches?.sort((a: Match, b: Match) => (dayjs(a.createdTime).isBefore(dayjs(b.createdTime)) ? -1 : 1)) || []}
          players={players || []}
          onAdd={() => {
            getNextMatch(event)
              .then((newMatch) => {
                if (newMatch) {
                  saveMatch(newMatch);
                  if (matches) {
                    setMatches([...matches, newMatch]);
                  } else {
                    setMatches([newMatch]);
                  }
                }
              }, () => { });
          }}
          onDelete={(myMatch: Match) => {
            deleteMatch(myMatch);
          }}
          onUpdate={(myMatch: Match, myStatus: MatchStatus | keyof typeof MatchStatus | undefined) => {
            if (myMatch.status !== myStatus) {
              saveMatch(Match.copyOf(myMatch, (updated) => {
                updated.status = myStatus;
              }));
            }
          }}
        />
      </div>
      <div className={classes.eventPlayersSummary}>
        <PlayersSummary
          eventType={event.type || EventType.GENERIC_EVENT}
          players={players || []}
          matches={matches || []}
        />
      </div>
    </div>
  );
};

export default EventPanel;
