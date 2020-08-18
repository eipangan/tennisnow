import { DeleteOutlined, PlusOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import { EventContext } from './EventContext';
import EventSettings from './EventSettings';
import { deleteEvent } from './EventUtils';
import { ThemeType } from './Theme';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  buttonsContainer: {
    display: 'flex',
    outline: 'none',
  },
}));

/**
 * EventButtons component - delete button and new/settings button
 *
 * @param props
 */
const EventButtons = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const history = useHistory();
  const { event } = useContext(EventContext);
  const [isEventSettingsVisible, setIsEventSettingsVisible] = useState<boolean>(false);

  /**
   * DeleteButton
   */
  const DeleteButton = () => (
    <Popconfirm
      cancelText={t('cancel')}
      icon={<QuestionCircleOutlined />}
      okText={t('delete')}
      placement="bottom"
      title={t('deleteEventConfirm')}
      onCancel={(e) => {
        if (e) e.stopPropagation();
      }}
      onConfirm={async (e) => {
        if (event) deleteEvent(event);
        history.push('/');
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

  /**
   * NewEventButton
   */
  const NewEventButton = () => (
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

  /**
   * SettingsButton
   */
  const SettingsButton = (): JSX.Element => (
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

  /**
   * SettingsDrawer
   */
  const SettingsDrawer = (): JSX.Element => {
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
      {(() => {
        if (!event) return <NewEventButton />;
        return (
          <>
            <DeleteButton />
            <div style={{ width: '12px' }} />
            <SettingsButton />
          </>
        );
      })()}
      <SettingsDrawer />
    </div>
  );
};

EventButtons.defaultProps = {
  eventID: '',
};

export default EventButtons;
