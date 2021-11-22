import Table, { ColumnProps } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Match, MatchStatus, Player } from './models';
import { ThemeType } from './Theme';
import { getPlayerName } from './utils/PlayerUtils';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  playersSummary: {
    background: 'transparent',
  },
}));

type PlayersSummaryProps = {
  matches: Match[],
  players: Player[],
}

const PlayersSummary = (props: PlayersSummaryProps) => {
  const { t } = useTranslation();
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });

  const { matches, players } = props;

  interface PlayerStatusType {
    playerName: string;
    numWon: number;
    numLost: number;
    numDraws: number;
  }

  const [datasource, setDatasource] = useState<PlayerStatusType[]>([]);
  const [columns, setColumns] = useState<ColumnProps<PlayerStatusType>[]>();

  // recalculate statistics if players changes
  useEffect(() => {
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
            if (match.playerIndices && match.playerIndices.length >= 2) {
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

    if (JSON.stringify(columns) !== JSON.stringify(myColumns)) {
      setColumns(myColumns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches, players]);

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
