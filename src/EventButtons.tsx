import { DeleteOutlined, PlusOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import EventSettings from './EventSettings';
import { deleteEvent } from './EventUtils';
import { Event } from './models';
import { ThemeType } from './Theme';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  buttonsContainer: {
    display: 'flex',
    outline: 'none',
  },
}));

/**
 * EventButtonsProps
 */
type EventButtonsProps = {
  eventID?: string,
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
  const theme = useTheme();
  const classes = useStyles({ theme });

  const history = useHistory();
  const { eventID, event } = props;
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
    if (!event || !isEventSettingsVisible) return <></>;
    return (
      <EventSettings
        eventID={eventID || ''}
        onClose={() => {
          setIsEventSettingsVisible(false);
        }}
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
      <DeleteButton />
      <div style={{ width: '12px' }} />
      <SettingsButton />
      <SettingsDrawer />
    </div>
  );
};

export default EventButtons;
