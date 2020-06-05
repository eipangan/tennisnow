import { DeleteOutlined, PlusOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { DataStore } from 'aws-amplify';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Event } from '../../models';
import EventSettings from './EventSettings';
import { getNewEvent } from './EventUtils';

/**
 * EventSettingsButtonProps
 */
type EventSettingsButtonProps = {
  event?: Event,
  setEvent?: Dispatch<SetStateAction<Event | undefined>>,
}

/**
 * EventSettingsButton component
 *
 * @param props
 */
const EventSettingsButton = (props: EventSettingsButtonProps): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const { event, setEvent } = props;
  const [isEventSettingsVisible, setIsEventSettingsVisible] = useState<boolean>(false);

  const DeleteButton = () => (
    <Popconfirm
      cancelText={t('cancel')}
      icon={<QuestionCircleOutlined />}
      okText={t('delete')}
      placement="left"
      title={t('deleteEventConfirm')}
      onCancel={(e) => {
        if (e) e.stopPropagation();
      }}
      onConfirm={(e) => {
        if (event) {
          DataStore.delete(event);
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

  const SettingsDrawer = () : JSX.Element => {
    if (!isEventSettingsVisible) return <></>;
    return (
      <EventSettings
        event={event || getNewEvent()}
        isVisible={isEventSettingsVisible}
        onClose={() => {
          setIsEventSettingsVisible(false);
        }}
        onOk={(myEvent: Event) => {
          if (setEvent) setEvent(myEvent);
          DataStore.save(myEvent);
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

export default EventSettingsButton;
