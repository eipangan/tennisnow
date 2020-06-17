import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
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
      const allMatches = await DataStore.query(Match);
      const fetchedMatches = allMatches.filter((m) => m.eventID === event.id);
      setMatches(fetchedMatches);
    };

    fetchMatches();
    const subscription = DataStore.observe(Match).subscribe(() => {
      fetchMatches();
    });
    return () => subscription.unsubscribe();
  }, [event.id]);

  return (
    <div className={classes.event}>
      {dayjs(event.date).calendar()}
      <MatchesList
        matches={matches || []}
        players={event.players || []}
        extra={(
          <>
            <Button
              data-testid="add-match"
              icon={<PlusOutlined />}
              shape="circle"
              onClick={() => {
                const newMatch = getNextMatch(event.id, event.players, matches);
                if (newMatch) {
                  saveMatch(newMatch);
                  if (matches) {
                    setMatches([...matches, newMatch]);
                  } else {
                    setMatches([newMatch]);
                  }
                }
              }}
            />
          </>
        )}
      />
      <div className={classes.eventPlayersSummary}>
        <PlayersSummary event={event} />
      </div>
    </div>
  );
};

export default EventPanel;
