import { DeleteOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Event } from '../../models';
import MatchesPanel from '../match/MatchesPanel';
import PlayersSummary from '../player/PlayersSummary';
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
  eventPlayersSummary: {
    background: 'transparent',
  },
}));

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
 * EventPanelProps
 */
type EventPanelProps = {
  event: Event;
  onUpdate?: () => void;
}


/**
 * EventPanel
 *
 * @param props
 */
const EventPanel = (props: EventPanelProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { event, onUpdate } = props;

  return (
    <div className={classes.event}>
      {dayjs(event.date).calendar()}
      <MatchesPanel
        matches={event.orderedMatches}
        onUpdate={onUpdate}
      />
      <div className={classes.eventPlayersSummary}>
        <PlayersSummary event={event} />
      </div>
    </div>
  );
};

export default EventPanel;
