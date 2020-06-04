import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataStore } from 'aws-amplify';
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
  const { event, setEvent } = props;
  const [isEventSettingsVisible, setIsEventSettingsVisible] = useState<boolean>(false);
  let button = (
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

  if (!event) {
    button = (
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
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      role="button"
      tabIndex={0}
    >
      {button}
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
    </div>
  );
};

export default EventSettingsButton;
