import { Tabs } from 'antd';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Event } from '../../models';
import { ThemeType } from '../utils/Theme';
import { useLocalStorage } from '../utils/Utils';
import EventButtons from './EventButtons';
import EventsList from './EventsList';

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

  const [activeTab, setActiveTab] = useLocalStorage<string>('activeTab', 'events');

  return (
    <>
      <Tabs
        className={classes.eventsPanel}
        defaultActiveKey={activeTab}
        onChange={(myActiveKey) => setActiveTab(myActiveKey)}
        tabBarExtraContent={
          <EventButtons />
      }
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
    </>
  );
};

export default EventsPanel;
