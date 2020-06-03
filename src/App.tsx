import { CopyrightCircleOutlined, LoginOutlined, TwitterOutlined, UserOutlined } from '@ant-design/icons';
import Auth, { CognitoUser } from '@aws-amplify/auth';
import { Button, PageHeader, Tag } from 'antd';
import { DataStore, Hub } from 'aws-amplify';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import React, { Suspense, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Route, Switch, useHistory } from 'react-router-dom';
import { DeleteButton, SettingsButton } from './components/event/EventPanel';
import { getNewEvent } from './components/event/EventUtils';
import { ThemeType } from './components/utils/Theme';
import { ReactComponent as AppTitle } from './images/title.svg';
import { Event } from './models';

const AppIntro = React.lazy(() => import('./AppIntro'));
const EventPanel = React.lazy(() => import('./components/event/EventPanel'));
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
 * EventRoute component
 *
 * @param props
 */
const EventRoute = (props: any): JSX.Element => {
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { match } = props;
  const [event, setEvent] = useState<Event>(getNewEvent());

  const fetchEvent = async (id: string) => {
    const myEvent = await DataStore.query(Event, id);
    setEvent(myEvent);
  };

  useEffect(() => {
    fetchEvent(match.params.id);
  }, [match.params.id]);

  return (
    <>
      <PageHeader
        className={classes.appHeader}
        onBack={() => history.push('/')}
        title={(<AppTitle />)}
        extra={[
          <DeleteButton
            key="delete"
            onConfirm={(e) => {
              if (e) {
                if (event) DataStore.delete(event);
                history.push('/');
                e.stopPropagation();
              }
            }}
          />,
          <SettingsButton
            key="settings"
            onClick={(e) => {
              if (e) e.stopPropagation();
            }}
          />,
        ]}
      />
      <Suspense fallback={<div className="loader" />}>
        <EventPanel event={event} />
      </Suspense>
    </>
  );
};

/**
 * App
 */
const App = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const [isUserSettingsVisible, setIsUserSettingsVisible] = useState<boolean>(false);
  const [user, setUser] = useState<CognitoUser>();
  const [events, setEvents] = useState<Event[]>();

  // initialize google-analytics
  ReactGA.initialize('UA-320746-14');
  ReactGA.pageview(window.location.pathname + window.location.search);

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
  const AppBody = (): JSX.Element => {
    if (user) return <EventsPanel events={events || []} />;
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
   * fetchEvents
   */
  const fetchEvents = async () => {
    const myEvents = await DataStore.query(Event);
    setEvents(myEvents);
  };

  /**
   * authenticateUser
   */
  const authenticateUser = async () => {
    const myUser = await Auth.currentAuthenticatedUser();
    setUser(myUser);
  };

  /**
   * useEffect Section
   */

  useEffect(() => {
    authenticateUser();
    fetchEvents();
    const subscription = DataStore.observe(Event).subscribe(() => fetchEvents());
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    i18n.changeLanguage(navigator.language);
  }, [i18n]);

  useEffect(() => {
    dayjs.locale(i18n.language);
    document.title = `${t('title')} | ${t('slogan')}`;
  }, [i18n.language, t]);

  /**
   * return Section
   */
  return (
    <div className={classes.app}>
      <div className={classes.appContent}>
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
              <AppBody />
            </Suspense>
          </Route>
        </Switch>
        <Suspense fallback={<div className="loader" />}>
          {(() => {
            if (isUserSettingsVisible && user) return <UserSettings user={user} />;
            return null;
          })()}
        </Suspense>
      </div>
      <div className={classes.appFooter}>
        <AppCopyright />
      </div>
    </div>
  );
};

export default App;
