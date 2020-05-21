import { PlusOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { AppContext } from '../../AppContext';
import { ThemeType } from '../utils/Theme';
import { EventType, getNewEvent } from './Event';
import EventsList from './EventsList';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  eventsPanel: {
    background: 'transparent',
  },
}));

/**
 * EventsPanelProps
 */
type EventsPanelProps = {
  data: EventType[];
}

/**
 * EventsPanel Component
 *
 * @param props
 */
const EventsPanel = (props: EventsPanelProps): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { data } = props;
  const { setEvent, setIsEventSettingsVisible } = useContext(AppContext);

  const { TabPane } = Tabs;

  /**
   * NewEventButton Component
   */
  const NewEventButton = (): JSX.Element => (
    <Button
      onClick={(e) => {
        setEvent(getNewEvent());
        setIsEventSettingsVisible(true);
        e.stopPropagation();
      }}
      type="primary"
      icon={<PlusOutlined />}
    >
      {t('newEvent')}
    </Button>
  );

  return (
    <Tabs
      className={classes.eventsPanel}
      defaultActiveKey="upoming"
      tabBarExtraContent={<NewEventButton />}
    >
      <TabPane key="events" tab={t('events')}>
        <EventsList
          data={data
            .filter((a: EventType) => dayjs(a.date).isSameOrAfter(dayjs().startOf('day')))
            .sort((a: EventType, b: EventType) => (dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1))}
        />
      </TabPane>
      <TabPane key="finished" tab={t('finished')}>
        <EventsList
          data={data
            .filter((a: EventType) => dayjs(a.date).isBefore(dayjs().startOf('day')))
            .sort((a: EventType, b: EventType) => (dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1))}
        />
      </TabPane>
    </Tabs>
  );
};

export default EventsPanel;
