import { CopyrightCircleOutlined, LoginOutlined, TwitterOutlined, UserOutlined } from '@ant-design/icons';
import Auth, { CognitoUser } from '@aws-amplify/auth';
import { Button, PageHeader, Tag } from 'antd';
import Amplify, { Hub } from 'aws-amplify';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import React, { Suspense, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Route, Switch, useHistory } from 'react-router-dom';
import { AppContext, AppContextType } from './AppContext';
import awsconfig from './aws-exports';
import { DeleteButton, EventType, getNewEvent, SettingsButton } from './components/event/Event';
import { ThemeType } from './components/utils/Theme';
import { useLocalStorage } from './components/utils/Utils';
import { ReactComponent as AppTitle } from './title.svg';

const AppIntro = React.lazy(() => import('./AppIntro'));
const Event = React.lazy(() => import('./components/event/Event'));
const EventSettings = React.lazy(() => import('./components/event/EventSettings'));
const EventsPanel = React.lazy(() => import('./components/event/EventsPanel'));
const UserSettings = React.lazy(() => import('./components/user/UserSettings'));

// initialize dayjs
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
awsconfig.oauth.domain = 'auth.tennisnow.net';
awsconfig.oauth.redirectSignIn = `${window.location.origin}/`;
awsconfig.oauth.redirectSignOut = `${window.location.origin}/`;
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
  appIntro: {
    background: 'white',
    height: '160px',
  },
  appFooter: {
    background: 'transparent',
    fontSize: 'small',
    lineHeight: '39px',
    padding: '12px 0px',
  },
}));

/**
 * App
 */
const App = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const [events, setEvents] = useLocalStorage<EventType[]>('events', []);
  const [event, setEvent] = useLocalStorage<EventType>('event', getNewEvent());

  const [isEventSettingsVisible, setIsEventSettingsVisible] = useState<boolean>(false);
  const [isUserSettingsVisible, setIsUserSettingsVisible] = useState<boolean>(false);
  const [user, setUser] = useState<CognitoUser | undefined>(undefined);

  // initialize google-analytics
  ReactGA.initialize('UA-320746-14');
  ReactGA.pageview(window.location.pathname + window.location.search);

  // initialize amplify hub
  Hub.listen('auth', (data) => {
    switch (data.payload.event) {
      case 'signIn':
        setUser(data.payload.data);
        break;
      case 'signIn_failure':
        setUser(undefined);
        break;
      case 'signOut':
        setUser(undefined);
        break;
      default:
        break;
    }
  });

  // initialize app AppContext
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
   * AppBody Component
   */
  const AppBody = (): JSX.Element => {
    if (user) return <EventsPanel data={events} />;
    return <AppIntro />;
  };

  /**
   * AppCopyright Component
   */
  const AppCopyright = (): JSX.Element => (
    <>
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
    </>
  );

  /**
   * UserButton Component
   */
  const UserButton = (): JSX.Element => {
    if (user) {
      return (
        <Button
          icon={<UserOutlined />}
          key="user"
          onClick={() => { setIsUserSettingsVisible(true); }}
          shape="round"
          style={{ background: '#ffffff50' }}
          type="default"
        >
          {user.getUsername()}
        </Button>
      );
    }
    return (
      <Button
        icon={<LoginOutlined />}
        key="user"
        onClick={() => { Auth.federatedSignIn(); }}
        shape="round"
        style={{}}
        type="primary"
      >
        {t('signin')}
      </Button>
    );
  };

  /**
   * useEffect Section
   */

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((myUser) => {
        setUser(myUser);
      })
      .catch(() => {
        setUser(undefined);
      });
  }, []);

  useEffect(() => {
    i18n.changeLanguage(navigator.language);
  }, [i18n]);

  useEffect(() => {
    dayjs.locale(i18n.language);
    document.title = `${t('title')} | ${t('slogan')}`;
  }, [i18n.language, t]);

  useEffect(() => {
    if (event && event.eventID) {
      app.events.update(event);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  /**
   * return Section
   */
  return (
    <div className={classes.app}>
      <div className={classes.appContent}>
        <AppContext.Provider value={app}>
          <Switch>
            <Route path={['/event']}>
              <PageHeader
                className={classes.appHeader}
                onBack={() => history.push('/')}
                title={(<AppTitle />)}
                extra={[
                  <DeleteButton
                    key="delete"
                    onConfirm={(e) => {
                      if (e) {
                        app.events.remove(event.eventID);
                        history.push('/');
                        e.stopPropagation();
                      }
                    }}
                  />,
                  <SettingsButton
                    key="settings"
                    onClick={(e) => {
                      setIsEventSettingsVisible(true);
                      if (e) e.stopPropagation();
                    }}
                  />,
                ]}
              />
              <Suspense fallback={<div className="loader" />}>
                <Event />
              </Suspense>
            </Route>
            <Route path={['/']}>
              <PageHeader
                className={classes.appHeader}
                title={(<AppTitle />)}
                extra={[
                  <UserButton key="user" />,
                ]}
              />
              <Suspense fallback={<div className="loader" />}>
                <AppBody />
              </Suspense>
            </Route>
          </Switch>
          <Suspense fallback={<div className="loader" />}>
            {(() => {
              if (isEventSettingsVisible) return <EventSettings />;
              return null;
            })()}
            {(() => {
              if (isUserSettingsVisible) return <UserSettings user={user} />;
              return null;
            })()}
          </Suspense>
        </AppContext.Provider>
      </div>
      <div className={classes.appFooter}>
        <AppCopyright />
      </div>
    </div>
  );
};

export default App;
