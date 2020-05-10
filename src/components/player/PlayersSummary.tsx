import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { AppContext } from '../../App';
import { ThemeType } from '../utils/Theme';
import { PlayerType } from './Player';

const useStyle = createUseStyles((theme: ThemeType) => ({
  playersSummary: {
    background: 'transparent',
  },
}));

/**
 * PlayersSummary
 *
 * @param props
 */
const PlayersSummary = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyle({ theme });

  const { event } = useContext(AppContext);
  const { players } = event;

  if (!players) return <></>;

  interface PlayerStatusType {
    playerName: string;
    numWon: number;
    numLost: number;
    numDraws: number;
  }

  const dataSource: PlayerStatusType[] | undefined = [];
  players.forEach((player: PlayerType) => {
    const data: PlayerStatusType = {
      playerName: `${player.playerID} ${player.playerName}`,
      numWon: player.stats ? player.stats.numWon : 0,
      numLost: player.stats ? player.stats.numLost : 0,
      numDraws: player.stats ? player.stats.numDraws : 0,
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
