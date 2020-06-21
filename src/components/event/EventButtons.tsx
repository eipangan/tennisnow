import { DeleteOutlined, PlusOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Event, Player } from '../../models';
import EventSettings from './EventSettings';
import { deleteEvent, getNewEvent, saveEvent, savePlayers } from './EventUtils';

/**
 * EventButtonsProps
 */
type EventButtonsProps = {
  event?: Event,
  setEvent?: Dispatch<SetStateAction<Event | undefined>>,
}

/**
 * EventButtons component
 *
 * @param props
 */
const EventButtons = (props: EventButtonsProps): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const { event, setEvent } = props;
  const [isEventSettingsVisible, setIsEventSettingsVisible] = useState<boolean>(false);

  const DeleteButton = () => {
    if (event) {
      return (
        <Popconfirm
          cancelText={t('cancel')}
          icon={<QuestionCircleOutlined />}
          okText={t('delete')}
          placement="bottom"
          title={t('deleteEventConfirm')}
          onCancel={(e) => {
            if (e) e.stopPropagation();
          }}
          onConfirm={(e) => {
            if (event) {
              deleteEvent(event);
              history.push('/');
            }
          }}
        >
          <Button
            data-testid="delete"
            icon={<DeleteOutlined />}
            onClick={(e) => e.stopPropagation()}
            shape="circle"
          />
        </Popconfirm>
      );
    }

    return <></>;
  };

  const SettingsButton = (): JSX.Element => {
    if (event) {
      return (
        <Button
          data-testid="settings"
          icon={<SettingOutlined />}
          shape="circle"
          onClick={(e) => {
            setIsEventSettingsVisible(true);
            e.stopPropagation();
          }}
        />
      );
    }

    return (
      <Button
        data-testid="settings"
        icon={<PlusOutlined />}
        onClick={(e) => {
          setIsEventSettingsVisible(true);
          e.stopPropagation();
        }}
        type="primary"
      >
        {t('newEvent')}
      </Button>
    );
  };

  const SettingsDrawer = (): JSX.Element => {
    if (!isEventSettingsVisible) return <></>;
    return (
      <EventSettings
        event={event || getNewEvent()}
        onClose={() => {
          setIsEventSettingsVisible(false);
        }}
        onOk={(myEvent: Event, myPlayers: Player[]) => {
          saveEvent(myEvent);
          if (setEvent) setEvent(myEvent);

          savePlayers(myEvent.id, myPlayers);
          setIsEventSettingsVisible(false);
        }}
      />
    );
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      role="button"
      tabIndex={0}
      style={{ display: 'flex' }}
    >
      <DeleteButton />
      <div style={{ width: '12px' }} />
      <SettingsButton />
      <SettingsDrawer />
    </div>
  );
};

export default EventButtons;
