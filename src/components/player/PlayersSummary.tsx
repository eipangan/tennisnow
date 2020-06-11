import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Event } from '../../models';
import { ThemeType } from '../utils/Theme';
import { getPlayerName } from './PlayerUtils';


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
  event: Event;
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

  const { event } = props;
  const { players } = event;

  if (!players) return <></>;

  interface PlayerStatusType {
    playerName: string;
    numWon: number;
    numLost: number;
    numDraws: number;
  }

  const dataSource: PlayerStatusType[] | undefined = [];
  players.forEach((player, index) => {
    const data: PlayerStatusType = {
      playerName: getPlayerName(player) || String(index + 1),
      numWon: 0,
      numLost: 0,
      numDraws: 0,
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
