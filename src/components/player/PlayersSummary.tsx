import Table, { ColumnProps } from 'antd/lib/table';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Match, MatchStatus, Player } from '../../models';
import { ThemeType } from '../utils/Theme';
import getPlayerName from './PlayerUtils';


// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  playersSummary: {
    background: 'transparent',
  },
}));

/**
 * PlayersSummaryProps
 */
type PlayersSummaryProps = {
  players: Player[],
  matches: Match[],
};

/**
 * PlayersSummary
 *
 * @param props
 */
const PlayersSummary = (props: PlayersSummaryProps): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { players, matches } = props;

  if (!players) return <></>;

  interface PlayerStatusType {
    playerName: string;
    numWon: number;
    numLost: number;
    numDraws: number;
  }

  const dataSource: PlayerStatusType[] | undefined = [];
  players.forEach((player, index) => {
    const getStats = (
      myIndex: number,
      myMatches: Match[],
    ) => {
      let numWon = 0;
      let numLost = 0;
      let numDraws = 0;

      myMatches.forEach((match) => {
        if (match.status && match.playerIndices && match.playerIndices.length === 2) {
          const p1 = match.playerIndices[0];
          const p2 = match.playerIndices[1];

          switch (match.status) {
            case MatchStatus.TEAM1_WON:
              if (index === p1) numWon += 1;
              if (index === p2) numLost += 1;
              break;
            case MatchStatus.DRAW:
              if (index === p1) numDraws += 1;
              if (index === p2) numDraws += 1;
              break;
            case MatchStatus.TEAM2_WON:
              if (index === p1) numLost += 1;
              if (index === p2) numWon += 1;
              break;
            default:
          }
        }
      });

      return { numWon, numLost, numDraws };
    };

    const { numWon, numLost, numDraws } = getStats(index, matches);
    const data: PlayerStatusType = {
      playerName: getPlayerName(player) || String(index + 1),
      numWon,
      numLost,
      numDraws,
    };
    dataSource.push(data);
  });

  const columns: ColumnProps<PlayerStatusType>[] = [
    {
      title: '',
    },
    {
      title: <div>{t('player')}</div>,
      dataIndex: 'playerName',
      align: 'left',
    },
    {
      title: <div>{t('won')}</div>,
      dataIndex: 'numWon',
      align: 'center',
    },
    {
      title: <div>{t('lost')}</div>,
      dataIndex: 'numLost',
      align: 'center',
    },
    {
      title: <div>{t('draw')}</div>,
      dataIndex: 'numDraws',
      align: 'center',
    },
  ];

  return (
    <Table
      className={classes.playersSummary}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      rowKey="playerName"
      size="small"
    />
  );
};

export default PlayersSummary;
