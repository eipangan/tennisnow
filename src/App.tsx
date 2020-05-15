import {
  CopyrightCircleOutlined, DeleteOutlined, LoginOutlined, PlusOutlined, QuestionCircleOutlined, SettingOutlined, TwitterOutlined, UserOutlined,
} from '@ant-design/icons';
import {
  Button, Empty, List, PageHeader, Popconfirm, Tabs, Tag,
} from 'antd';
import Amplify, { Auth } from 'aws-amplify';
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
import awsconfig from './aws-exports';
import { EventType, getNewEvent } from './components/event/Event';
import { ThemeType } from './components/utils/Theme';
import { useLocalStorage } from './components/utils/Utils';
import { ReactComponent as AppTitle } from './title.svg';

const Event = React.lazy(() => import('./components/event/Event'));
const EventSettings = React.lazy(() => import('./components/event/EventSettings'));
const UserSettings = React.lazy(() => import('./components/user/UserSettings'));

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

// initialize amplify
Amplify.configure(awsconfig);

// initialize styles
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
    margin: '0px',
    padding: '0px',
  },
  appEventsTab: {
    background: 'transparent',
  },
  appEventsList: {
    background: 'transparent',
  },
  appEvent: {
    background: `${theme.baseColor}90`,
    margin: '0px 0px',
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
  isEventSettingsVisible: boolean,
  setIsEventSettingsVisible: Dispatch<SetStateAction<boolean>> | (() => {}),
  isUserSettingsVisible: boolean,
  setIsUserSettingsVisible: Dispatch<SetStateAction<boolean>> | (() => {}),
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
  const [isEventSettingsVisible, setIsEventSettingsVisible] = useState<boolean>(false);
  const [isUserSettingsVisible, setIsUserSettingsVisible] = useState<boolean>(false);
  const [user, setUser] = useState<string | undefined>(undefined);

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
    isEventSettingsVisible,
    setIsEventSettingsVisible,
    isUserSettingsVisible,
    setIsUserSettingsVisible,
  };

  /**
   * NewEventButton Component
   */
  const NewEventButton = () => (
    <Button
      onClick={(e) => {
        setEvent(getNewEvent());
        setIsEventSettingsVisible(true);
        e.stopPropagation();
      }}
      type="primary"
      icon={<PlusOutlined />}
    />
  );

  /**
   * UserButton Component
   */
  const UserButton = () => {
    const icon = user ? <UserOutlined /> : <LoginOutlined />;
    const label = user ? null : t('signin');
    const type = user ? 'default' : 'primary';
    const style = user ? { background: '#ffffff50' } : {};

    return (
      <Button
        icon={icon}
        key="user"
        onClick={() => history.push('/auth')}
        shape="round"
        style={style}
        type={type}
      >
        {label}
      </Button>
    );
  };

  /**
   * EmptyEvents Component
   */
  const EmptyEvents = () => (
    <Empty
      description={t('noEvents')}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  );

  /**
   * EventsList Component
   *
   * @param props
   */
  const EventsList = (props: { data: any[] }) => {
    const { data } = props;
    return (
      <List
        className={classes.appEventsList}
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
                  if (myEvent) {
                    app.events.remove(myEvent.eventID);
                  }
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
                  setIsEventSettingsVisible(true);
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

  /**
   * useEffect Section
   */

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(((myUser) => {
        setUser(myUser.username);
      }))
      .catch(() => {
        setUser(undefined);
      });
  }, [isUserSettingsVisible]);

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

  useEffect(() => {
  }, [user]);

  /**
   * return Section
   */
  return (
    <div className={classes.app}>
      <div className={classes.appContent}>
        <AppContext.Provider value={app}>
          <Switch>
            <Route path="/auth">
              <Suspense fallback={<div className="loader" />}>
                <PageHeader
                  className={classes.appHeader}
                  onBack={() => history.push('/')}
                  title={(<AppTitle />)}
                  extra={[
                    <UserButton key="user" />,
                  ]}
                />
                <UserSettings />
              </Suspense>
            </Route>
            <Route path="/event">
              <PageHeader
                className={classes.appHeader}
                onBack={() => history.push('/')}
                title={(<AppTitle />)}
                subTitle={dayjs(event.date).calendar()}
                extra={[
                  <Popconfirm
                    cancelText={t('cancel')}
                    icon={<QuestionCircleOutlined />}
                    key="delete"
                    okText={t('delete')}
                    placement="left"
                    title={t('deleteEventConfirm')}
                    onCancel={(e) => {
                      if (e) e.stopPropagation();
                    }}
                    onConfirm={(e) => {
                      if (e) {
                        app.events.remove(event.eventID);
                        history.push('/');
                        e.stopPropagation();
                      }
                    }}
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={(e) => e.stopPropagation()}
                      shape="circle"
                    />
                  </Popconfirm>,
                  <Button
                    icon={<SettingOutlined />}
                    key="setting"
                    onClick={() => setIsEventSettingsVisible(true)}
                    shape="circle"
                  />,
                ]}
              />
              <Suspense fallback={<div className="loader" />}>
                <Event />
              </Suspense>
            </Route>
            <Route path="/">
              <PageHeader
                className={classes.appHeader}
                title={(<AppTitle />)}
                extra={[
                  <UserButton key="user" />,
                ]}
              />
              <Tabs
                className={classes.appEventsTab}
                defaultActiveKey="upoming"
                tabBarExtraContent={<NewEventButton />}
              >
                <TabPane key="events" tab={t('events')}>
                  <EventsList
                    data={events
                      .filter((a: EventType) => dayjs(a.date).isSameOrAfter(dayjs().startOf('day')))
                      .sort((a: EventType, b: EventType) => (dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1))}
                  />
                </TabPane>
                <TabPane key="finished" tab={t('finished')}>
                  <EventsList
                    data={events
                      .filter((a: EventType) => dayjs(a.date).isBefore(dayjs().startOf('day')))
                      .sort((a: EventType, b: EventType) => (dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1))}
                  />
                </TabPane>
              </Tabs>
            </Route>
          </Switch>
          <Suspense fallback={<div className="loader" />}>
            {(() => {
              if (isEventSettingsVisible) return <EventSettings />;
              return null;
            })()}
            {(() => {
              if (isUserSettingsVisible) return <UserSettings />;
              return null;
            })()}
          </Suspense>
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
