import Table, { ColumnProps } from 'antd/lib/table';
import { DataStore } from 'aws-amplify';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { EventContext } from './EventContext';
import { EventType, Match, MatchStatus, Player } from './models';
import { ThemeType } from './Theme';
import { getPlayers } from './utils/EventUtils';
import { getPlayerName } from './utils/PlayerUtils';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  playersSummary: {
    background: 'transparent',
  },
}));

/**
 * PlayersSummary
 *
 * @param props
 */
const PlayersSummary = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { event } = useContext(EventContext);
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchMatches = async (eid: string) => {
      const fetchedMatches = await DataStore.query(Match, (m) => m.eventID('eq', eid));
      if (mounted) {
        setMatches(fetchedMatches);
      }
    };

    if (!event) return () => { };
    fetchMatches(event.id);
    const subscription = DataStore.observe(Match,
      (m) => m.eventID('eq', event.id))
      .subscribe(() => fetchMatches(event.id));
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  useEffect(() => {
    let mounted = true;
    const fetchPlayers = async (eid: string) => {
      const fetchedPlayers = await getPlayers(eid);
      if (mounted) {
        setPlayers(fetchedPlayers);
      }
    };

    if (!event) return () => { };
    fetchPlayers(event.id);
    const subscription = DataStore.observe(Player,
      (p) => p.eventID('eq', event.id))
      .subscribe(() => fetchPlayers(event.id));
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

  interface PlayerStatusType {
    playerName: string;
    numWon: number;
    numLost: number;
    numDraws: number;
  }

  const [datasource, setDatasource] = useState<PlayerStatusType[]>([]);
  const [columns, setColumns] = useState<ColumnProps<PlayerStatusType>[]>();

  useEffect(() => {
    // set datasource if players exist
    if (players) {
      const myDatasource: PlayerStatusType[] = [];
      players.forEach((player, index) => {
        const getStats = (
          myIndex: number,
          myMatches: Match[],
        ) => {
          let numWon = 0;
          let numLost = 0;
          let numDraws = 0;

          myMatches.forEach((match) => {
            if (match.status && match.playerIndices && match.playerIndices.length >= 2) {
              const p1 = match.playerIndices[0];
              const p2 = match.playerIndices[1];

              switch (match.status) {
                case MatchStatus.PLAYER1_WON:
                  if (index === p1) numWon += 1;
                  if (index === p2) numLost += 1;
                  break;
                case MatchStatus.DRAW:
                  if (index === p1) numDraws += 1;
                  if (index === p2) numDraws += 1;
                  break;
                case MatchStatus.PLAYER2_WON:
                  if (index === p1) numLost += 1;
                  if (index === p2) numWon += 1;
                  break;
                default:
              }
            }
          });

          return { numWon, numLost, numDraws };
        };

        const { numWon, numLost, numDraws } = getStats(index, matches || []);
        const playerStatusType: PlayerStatusType = {
          playerName: getPlayerName(player) || String(index + 1),
          numWon,
          numLost,
          numDraws,
        };
        myDatasource.push(playerStatusType);
      });
      if (JSON.stringify(datasource) !== JSON.stringify(myDatasource)) {
        setDatasource(myDatasource);
      }
    }

    // set columns
    const myColumns: ColumnProps<PlayerStatusType>[] = [
      {
        title: '',
      },
      {
        title: <div>{t('player')}</div>,
        dataIndex: 'playerName',
        align: 'left',
      },
    ];

    switch (event?.type) {
      case EventType.GENERIC_EVENT:
        myColumns.push({
          title: '',
        });

        myColumns.push({
          title: '',
        });

        myColumns.push({
          title: '',
        });

        break;

      case EventType.SINGLES_ROUND_ROBIN:
      case EventType.FIX_DOUBLES_ROUND_ROBIN:
      case EventType.SWITCH_DOUBLES_ROUND_ROBIN:
      default:
        myColumns.push({
          title: <div>{t('won')}</div>,
          dataIndex: 'numWon',
          align: 'center',
        });

        myColumns.push({
          title: <div>{t('lost')}</div>,
          dataIndex: 'numLost',
          align: 'center',
        });

        myColumns.push({
          title: <div>{t('draw')}</div>,
          dataIndex: 'numDraws',
          align: 'center',
        });

        break;
    }

    if (JSON.stringify(columns) !== JSON.stringify(myColumns)) {
      setColumns(myColumns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  return (
    <Table
      className={classes.playersSummary}
      columns={columns}
      dataSource={datasource}
      pagination={false}
      rowKey="playerName"
      size="small"
    />
  );
};

export default PlayersSummary;
