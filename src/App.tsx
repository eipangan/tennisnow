import { CopyrightCircleOutlined, LoginOutlined, TwitterOutlined, UserOutlined } from '@ant-design/icons';
import Auth, { CognitoUser } from '@aws-amplify/auth';
import { Alert, Button, PageHeader, Tag } from 'antd';
import { DataStore, Hub } from 'aws-amplify';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Route, Switch } from 'react-router-dom';
import { AppContext } from './AppContext';
import { ReactComponent as AppTitle } from './images/title.svg';
import { Event } from './models';
import { ThemeType } from './Theme';

const AppIntro = React.lazy(() => import('./AppIntro'));
const EventRoute = React.lazy(() => import('./EventRoute'));
const EventsPanel = React.lazy(() => import('./EventsPanel'));
const UserSettings = React.lazy(() => import('./UserSettings'));

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
const App = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });

  const [isUserSettingsVisible, setIsUserSettingsVisible] = useState<boolean>(false);
  const [user, setUser] = useState<CognitoUser>();
  const [events, setEvents] = useState<Event[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // initialize amplify hub
  Hub.listen('auth', (data) => {
    switch (data.payload.event) {
      case 'signIn':
      case 'signIn_failure':
      case 'signOut':
        setUser(data.payload.data);
        break;
      case 'cognitoHostedUI':
      case 'oAuthSignOut':
      default:
        break;
    }
  });

  /**
   * AppBody Component
   */
  const AppBody = () => {
    if (user) return <EventsPanel events={events || []} />;
    return <AppIntro />;
  };

  /**
   * AppCopyright Component
   */
  const AppCopyright = () => (
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
   * Loader
   */
  const Loader = () => {
    if (!user) return <></>;
    if (!isLoading) return <></>;
    return (
      <div className="loader" />
    );
  };

  /**
   * UserButton Component
   */
  const UserButton = () => {
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
   * authenticateUser
   */
  const authenticateUser = async () => {
    try {
      const myUser = await Auth.currentAuthenticatedUser();
      setUser(myUser);
    } catch (error) {
      // ignore
    }
  };

  /**
   * useEffect Section
   */

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchEvents = async () => {
      setIsLoading(true);
      const fetchedEvents = await DataStore.query(Event);
      if (mounted) {
        setEvents(fetchedEvents);
      }
      setIsLoading(false);
    };

    fetchEvents();
    const subscription = DataStore.observe(Event,
      (e) => e.owner('eq', user?.getUsername() || ''))
      .subscribe(() => fetchEvents());
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    i18n.changeLanguage(navigator.language);
  }, [i18n]);

  useEffect(() => {
    if (i18n.language.toLowerCase().startsWith('ja')) {
      dayjs.locale('ja');
    } else {
      dayjs.locale('en');
    }
    document.title = `${t('title')} | ${t('slogan')}`;
  }, [i18n.language, t]);

  /**
   * return Section
   */
  return (
    <div className={classes.app}>
      <div className={classes.appContent}>
        <Loader />
        <AppContext.Provider value={{ username: String(user?.getUsername()) }}>
          <Switch>
            <Route path="/event/:id" component={EventRoute} />
            <Route path="/">
              <PageHeader
                className={classes.appHeader}
                title={(<AppTitle />)}
                extra={[
                  <UserButton key="user" />,
                ]}
              />
              <Suspense fallback={<div className="loader" />}>
                <Alert message="BETA!!!" type="error" />
                <AppBody />
              </Suspense>
            </Route>
          </Switch>
          <Suspense fallback={<div className="loader" />}>
            {(() => {
              if (!isUserSettingsVisible || !user) return <></>;
              return (
                <UserSettings
                  onClose={() => setIsUserSettingsVisible(false)}
                />
              );
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
