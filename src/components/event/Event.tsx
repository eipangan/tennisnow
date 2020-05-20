import { DeleteOutlined, LeftOutlined, QuestionCircleOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { AppContext } from '../../AppContext';
import Match, { getMatches, getOrderedMatches, MatchType } from '../match/Match';
import { getPlayers, PlayerType } from '../player/Player';
import PlayersSummary from '../player/PlayersSummary';
import { getTeams, TeamType } from '../team/Team';
import { ThemeType } from '../utils/Theme';

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
  eventMatches: {
    alignItems: 'center',
    background: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'scroll',
    padding: {
      top: '9px',
      bottom: '12px',
    },
  },
  eventPlayersSummary: {
    background: 'transparent',
  },
}));

/**
 * EventType
 */
export interface EventType {
  eventID: string | undefined;
  date: Date;
  numPlayers: number;
  players: PlayerType[];
  teams: TeamType[];
  matches: MatchType[];
  orderedMatches: MatchType[];
}

/**
 * getNewEvent
 */
export const getNewEvent = (): EventType => {
  const defaultNumPlayers = 6;

  const numPlayers = defaultNumPlayers;
  const players = getPlayers(numPlayers);
  const teams = getTeams(players);
  const matches = getMatches(teams);
  const orderedMatches = getOrderedMatches(players, teams, matches);

  return {
    eventID: undefined,
    date: dayjs().add(1, 'hour').startOf('hour').toDate(),
    numPlayers,
    players,
    teams,
    matches,
    orderedMatches,
  };
};

/**
 * DeleteButton component
 *
 * @param props
 */
export const DeleteButton = (props: { onConfirm: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void }) => {
  const { t } = useTranslation();
  const { onConfirm } = props;

  return (
    <Popconfirm
      cancelText={t('cancel')}
      icon={<QuestionCircleOutlined />}
      okText={t('delete')}
      placement="left"
      title={t('deleteEventConfirm')}
      onCancel={(e) => {
        if (e) e.stopPropagation();
      }}
      onConfirm={onConfirm}
    >
      <Button
        data-testid="delete"
        icon={<DeleteOutlined />}
        onClick={(e) => e.stopPropagation()}
        shape="circle"
      />
    </Popconfirm>
  );
};

/**
 * SettingsButton component
 *
 * @param props
 */
export const SettingsButton = (props: { onClick: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void }): JSX.Element => {
  const { onClick } = props;

  return (
    <Button
      data-testid="settings"
      icon={<SettingOutlined />}
      shape="circle"
      onClick={onClick}
    />
  );
};

/**
 * Event
 *
 * @param props
 */
const Event = (): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { event, setEvent } = useContext(AppContext);

  return (
    <div className={classes.event}>
      {dayjs(event.date).calendar()}
      <div className={classes.eventMatches}>
        <RightOutlined />
        {event.orderedMatches && event.orderedMatches.map((match: MatchType) => (
          <div key={match.matchID}>
            <Match
              match={match}
              onUpdate={() => {
                if (event) {
                  setEvent({ ...event });
                }
              }}
            />
          </div>
        ))}
        <LeftOutlined />
      </div>
      <div className={classes.eventPlayersSummary}>
        <PlayersSummary />
      </div>
    </div>
  );
};

export default Event;
