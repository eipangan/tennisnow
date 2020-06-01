import { PlusOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Event } from '../../models';
import { ThemeType } from '../utils/Theme';
import EventSettings from './EventSettings';
import EventsList from './EventsList';
import { getNewEvent } from './EventUtils';

// initialize dayjs
dayjs.extend(isSameOrAfter);

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  eventsPanel: {
    background: 'transparent',
    margin: theme.margin,
  },
}));

/**
 * EventsPanelProps
 */
type EventsPanelProps = {
  events: Event[];
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

  const { events } = props;
  const { TabPane } = Tabs;

  const [event, setEvent] = useState<Event>(getNewEvent());
  const [isSettingsVisible, setIsSettingsVisible] = useState<Boolean>(false);

  /**
   * NewEventButton Component
   */
  const NewEventButton = (): JSX.Element => (
    <Button
      onClick={(e) => {
        setEvent(getNewEvent());
        setIsSettingsVisible(true);
        e.stopPropagation();
      }}
      type="primary"
      icon={<PlusOutlined />}
    >
      {t('newEvent')}
    </Button>
  );

  /**
   * EventSettingsPanel
   */
  const EventSettingsPanel = (): JSX.Element => {
    if (isSettingsVisible) {
      return (
        <EventSettings
          event={event}
          onClose={() => setIsSettingsVisible(false)}
        />
      );
    }

    return (<></>);
  };

  return (
    <>
      <Tabs
        className={classes.eventsPanel}
        defaultActiveKey="events"
        tabBarExtraContent={<NewEventButton />}
      >
        <TabPane key="events" tab={t('events')}>
          <EventsList
            events={events
              .filter((a: Event) => dayjs(a.date).isSameOrAfter(dayjs().startOf('day')))
              .sort((a: Event, b: Event) => (dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1))}
          />
        </TabPane>
        <TabPane key="finished" tab={t('finished')}>
          <EventsList
            events={events
              .filter((a: Event) => dayjs(a.date).isBefore(dayjs().startOf('day')))
              .sort((a: Event, b: Event) => (dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1))}
          />
        </TabPane>
      </Tabs>
      <EventSettingsPanel />
    </>
  );
};

export default EventsPanel;
