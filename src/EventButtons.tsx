import { SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { EventContext } from './EventContext';
import EventSettings from './EventSettings';
import { ThemeType } from './Theme';

const useStyles = createUseStyles((theme: ThemeType) => ({
  buttonsContainer: {
    display: 'flex',
    outline: 'none',
  },
}));

const EventButtons = () => {
  const { t } = useTranslation();
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });

  const { event } = useContext(EventContext);
  const [isEventSettingsVisible, setIsEventSettingsVisible] = useState<boolean>(false);

  const SettingsButton = () => (
    <Button
      data-testid="settings"
      icon={<SettingOutlined />}
      shape="round"
      onClick={(e) => {
        setIsEventSettingsVisible(true);
        e.stopPropagation();
      }}
    />
  );

  const SettingsDrawer = () => {
    if (!isEventSettingsVisible) return <></>;
    return (
      <EventSettings
        key={event?.id}
        onClose={() => setIsEventSettingsVisible(false)}
      />
    );
  };

  return (
    <div
      className={classes.buttonsContainer}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      role="button"
      tabIndex={0}
    >
      <SettingsButton />
      <SettingsDrawer />
    </div>
  );
};

EventButtons.defaultProps = {
  eventID: '',
};

export default EventButtons;
