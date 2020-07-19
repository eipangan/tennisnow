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
  const eventType = event.type;
  const [matches, setMatches] = useState<Match[]>();
  const [players, setPlayers] = useState<Player[]>();

  const EventMatchesList = () => {
    if (event && eventType === EventType.GENERIC_EVENT) return <></>;
    return (
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
          if (matches) {
            const newMatches = matches.filter((match) => match.id !== myMatch.id);
            deleteMatch(myMatch);
            setMatches(newMatches);
          }
        }}
        onUpdate={(myMatch: Match, myStatus: MatchStatus | keyof typeof MatchStatus | undefined) => {
          if (myMatch.status !== myStatus) {
            saveMatch(Match.copyOf(myMatch, (updated) => {
              updated.status = myStatus;
            }));
          }
        }}
      />
    );
  };

  // update matches
  useEffect(() => {
    const fetchMatches = async () => {
      const fetchedMatches = await getMatches(event.id);
      setMatches(fetchedMatches);
    };

    fetchMatches();
  }, [event.id]);

  // update players
  useEffect(() => {
    const fetchPlayers = async () => {
      const fetchedPlayers = await getPlayers(event.id);
      setPlayers(fetchedPlayers);
    };

    fetchPlayers();
  }, [event.id]);

  return (
    <div className={classes.eventPanel}>
      <div className={classes.eventSummary}>
        <strong>{dayjs(event.date).calendar()}</strong>
        <br />
        {event.summary}
      </div>
      <div className={classes.eventMatches}>
        <EventMatchesList />
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
