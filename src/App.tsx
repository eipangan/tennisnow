import {
  CopyrightCircleOutlined, DeleteOutlined, QuestionCircleOutlined, SettingOutlined, TwitterOutlined,
} from '@ant-design/icons';
import {
  Button, Empty, List, PageHeader, Popconfirm, Tabs, Tag,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import calendar from 'dayjs/plugin/calendar';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import React, {
  Dispatch, SetStateAction, Suspense, useEffect, useState,
} from 'react';
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Route, Switch, useHistory } from 'react-router-dom';
import { EventType, getNewEvent } from './components/event/Event';
import { ThemeType } from './components/utils/Theme';
import { useLocalStorage } from './components/utils/Utils';
import title from './title720x128.png';

const Event = React.lazy(() => import('./components/event/Event'));
const EventSettings = React.lazy(() => import('./components/event/EventSettings'));

// initialize dayjs
dayjs.extend(calendar);
dayjs.extend(isSameOrAfter);
dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);
dayjs.updateLocale('ja', {
  calendar: {
    lastDay: '[昨日] LT',
    sameDay: '[今日] LT',
    nextDay: '[明日] LT',
    lastWeek: '[先週]dddd LT',
    nextWeek: 'dddd LT',
    sameElse: 'lll',
  },
});
dayjs.updateLocale('en', {
  calendar: {
    sameElse: 'lll',
  },
});

const useStyles = createUseStyles((theme: ThemeType) => ({
  app: {
    background: theme.background,
    height: '100%',
    overflowX: 'scroll',
    position: 'fixed',
    textAlign: 'center',
    touchAction: 'manipulation',
    width: '100%',
  },
  appHeader: {
    background: 'transparent',
  },
  appContent: {
    background: 'transparent',
  },
  appEvents: {
    background: 'transparent',
  },
  appEvent: {
    background: `${theme.baseColor}90`,
    margin: '0px 12px',
    padding: '12px',
    textAlign: 'left',
  },
  appFooter: {
    background: 'transparent',
    fontSize: 'small',
    lineHeight: '39px',
    padding: '12px 0px',
  },
}));

/**
 * AppContextType
 */
export interface AppContextType {
  events: {
    add: (event: EventType) => boolean;
    get: (eventID: string | undefined) => EventType | undefined;
    update: (event: EventType) => boolean;
    remove: (eventID: string | undefined) => boolean;
  },
  event: EventType,
  setEvent: Dispatch<SetStateAction<EventType>> | (() => {}),
  isSettingsVisible: boolean,
  setIsSettingsVisible: Dispatch<SetStateAction<boolean>> | (() => {}),
}

export const AppContext = React.createContext({} as AppContextType);

/**
 * App
 */
const App = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const [events, setEvents] = useLocalStorage('events', []);
  const [event, setEvent] = useLocalStorage('event', getNewEvent());
  const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);

  const { TabPane } = Tabs;

  // initialize google-analytics
  ReactGA.initialize('UA-320746-14');
  ReactGA.pageview(window.location.pathname + window.location.search);

  const app: AppContextType = {
    events: {
      add: (myEvent: EventType): boolean => {
        if (!myEvent || !myEvent.eventID) return false;

        const otherEvents = events.filter((e: EventType) => e.eventID !== myEvent.eventID);
        if (otherEvents.length <= 0) {
          setEvents([myEvent]);
        } else {
          setEvents([...otherEvents, myEvent]);
        }

        return true;
      },
      get: (myEventID: string | undefined): EventType | undefined => {
        if (!myEventID) return undefined;

        return events.find((e: EventType) => e.eventID === myEventID);
      },
      update: (myEvent: EventType): boolean => {
        if (!myEvent || !myEvent.eventID) return false;

        const otherEvents = events.filter((e: EventType) => e.eventID !== myEvent.eventID);
        if (otherEvents.length <= 0) {
          setEvents([myEvent]);
        } else {
          setEvents([...otherEvents, myEvent]);
        }

        return true;
      },
      remove: (myEventID: string | undefined): boolean => {
        setEvents(events.filter((e: EventType) => e.eventID !== myEventID));
        if (event && event.eventID === myEventID) setEvent(getNewEvent());
        return true;
      },
    },
    event,
    setEvent,
    isSettingsVisible,
    setIsSettingsVisible,
  };

  const NewEventButton = () => (
    <Button
      onClick={(e) => {
        setEvent(getNewEvent());
        setIsSettingsVisible(true);
        e.stopPropagation();
      }}
      shape="round"
      type="primary"
    >
      {t('newEvent')}
    </Button>
  );

  const EmptyEvents = () => (
    <Empty
      description={t('noEvents')}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  );

  const EventsList = (props: { data: any[] }) => {
    const { data } = props;
    return (
      <List
        className={classes.appEvents}
        dataSource={data}
        locale={{ emptyText: <EmptyEvents /> }}
        renderItem={(myEvent: EventType) => (
          <List.Item
            className={classes.appEvent}
            key={myEvent.eventID}
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              setEvent(myEvent);
              history.push('/event/');
              e.stopPropagation();
            }}
            extra={[
              <Popconfirm
                cancelText={t('cancel')}
                icon={<QuestionCircleOutlined />}
                key="delete"
                okText={t('delete')}
                onCancel={(e) => {
                  if (e) e.stopPropagation();
                }}
                onConfirm={(e) => {
                  if (myEvent) app.events.remove(myEvent.eventID);
                  if (e) e.stopPropagation();
                }}
                placement="left"
                title={t('deleteEventConfirm')}
              >
                <Button
                  icon={<DeleteOutlined />}
                  onClick={(e) => e.stopPropagation()}
                  shape="circle"
                />
              </Popconfirm>,
              <div
                key="spacing"
                style={{ width: '12px' }}
              />,
              <Button
                icon={<SettingOutlined />}
                key="setting"
                onClick={(e) => {
                  setEvent(myEvent);
                  setIsSettingsVisible(true);
                  e.stopPropagation();
                }}
                shape="circle"
              />,
            ]}
          >
            <List.Item.Meta
              description={t('eventSummary', { numPlayers: myEvent.numPlayers })}
              title={dayjs(myEvent.date).calendar()}
            />
          </List.Item>
        )}
      />
    );
  };

  useEffect(() => {
    i18n.changeLanguage(navigator.language);
  }, [i18n]);

  useEffect(() => {
    dayjs.locale(i18n.language);
    document.title = `${t('title')} | ${t('subtitle')}`;
  }, [i18n.language, t]);

  useEffect(() => {
    if (event && event.eventID) {
      app.events.update(event);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return (
    <div className={classes.app}>
      <div className={classes.appContent}>
        <AppContext.Provider value={app}>
          <Switch>
            <Route path="/event">
              <Suspense fallback={<div className="loader" />}>
                <Event />
              </Suspense>
            </Route>
            <Route path="/">
              <>
                <PageHeader
                  className={classes.appHeader}
                  title={(
                    <img
                      src={title}
                      alt={t('title')}
                      width="180px"
                      height="32px"
                    />
                  )}
                  extra={[
                    <NewEventButton key="new" />,
                  ]}
                />
                <Tabs
                  className={classes.appEvents}
                  defaultActiveKey="upoming"
                >
                  <TabPane key="events" tab={t('events')}>
                    <EventsList
                      data={events
                        .filter((a: EventType) => dayjs(a.date).isSameOrAfter(dayjs().startOf('day')))
                        // eslint-disable-next-line max-len
                        .sort((a: EventType, b: EventType) => (dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1))}
                    />
                  </TabPane>
                  <TabPane key="finished" tab={t('finished')}>
                    <EventsList
                      data={events
                        .filter((a: EventType) => dayjs(a.date).isBefore(dayjs().startOf('day')))
                        // eslint-disable-next-line max-len
                        .sort((a: EventType, b: EventType) => (dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1))}
                    />
                  </TabPane>
                </Tabs>
              </>
            </Route>
          </Switch>
          {(() => {
            if (isSettingsVisible) {
              return (
                <Suspense fallback={<div className="loader" />}>
                  <EventSettings />
                </Suspense>
              );
            }
            return <></>;
          })()}
        </AppContext.Provider>
      </div>
      <div className={classes.appFooter}>
        {t('title')}
        {' '}
        <CopyrightCircleOutlined />
        {' '}
        2020
        {' '}
        <a href="https://twitter.com/tennisnownet">
          <Tag
            icon={<TwitterOutlined />}
            style={{ border: '0', background: 'transparent' }}
          >
            @tennisnownet
          </Tag>
        </a>
      </div>
    </div>
  );
};

export default App;
