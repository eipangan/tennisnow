import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Event, Match, MatchStatus, Player } from '../../models';
import MatchesList from '../match/MatchesList';
import { saveMatch } from '../match/MatchUtils';
import PlayersSummary from '../player/PlayersSummary';
import { ThemeType } from '../utils/Theme';
import { getMatches, getNextMatch, getPlayers } from './EventUtils';

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
  const { t } = useTranslation();
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
    const subscription = DataStore.observe(Match).subscribe(() => fetchMatches());
    return () => subscription.unsubscribe();
  }, [event.id]);

  // update players
  useEffect(() => {
    const fetchPlayers = async () => {
      const fetchedPlayers = await getPlayers(event.id);
      setPlayers(fetchedPlayers);
    };

    fetchPlayers();
    const subscription = DataStore.observe(Player).subscribe(() => fetchPlayers());
    return () => subscription.unsubscribe();
  }, [event.id]);

  return (
    <div className={classes.event}>
      {dayjs(event.date).calendar()}
      <MatchesList
        matches={matches?.sort((a: Match, b: Match) => (dayjs(a.createdTime).isBefore(dayjs(b.createdTime)) ? -1 : 1)) || []}
        players={players || []}
        extra={(
          <Button
            data-testid="add-match"
            icon={<PlusOutlined />}
            onClick={() => {
              getNextMatch(event.id)
                .then((newMatch) => {
                  if (newMatch) {
                    saveMatch(newMatch);
                    if (matches) {
                      setMatches([...matches, newMatch]);
                    } else {
                      setMatches([newMatch]);
                    }
                  }
                });
            }}
          >
            {t('newMatch')}
          </Button>
        )}
        onUpdate={(myMatch: Match, myStatus: MatchStatus | 'NEW' | 'PLAYER1_WON' | 'PLAYER2_WON' | 'DRAW' | undefined) => {
          if (myMatch.status !== myStatus) {
            saveMatch(Match.copyOf(myMatch, (updated) => {
              updated.status = myStatus;
            }));
          }
        }}
      />
      <div className={classes.eventPlayersSummary}>
        <PlayersSummary
          players={players || []}
          matches={matches || []}
        />
      </div>
    </div>
  );
};

export default EventPanel;
