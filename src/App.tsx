import { CloseOutlined, CopyrightCircleOutlined, TwitterOutlined } from '@ant-design/icons';
import { Button, PageHeader, Tag } from 'antd';
import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import EventPanel from './EventPanel';
import EventSettings from './EventSettings';
import { ReactComponent as AppTitle } from './images/title.svg';
import { Event, Match, Player } from './models';
import { ThemeType } from './Theme';

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
  appContent: {
    background: 'transparent',
    margin: '0px',
    padding: '0px',
  },
  appFooter: {
    background: 'transparent',
    fontSize: 'small',
    lineHeight: '39px',
    padding: '12px 0px',
  },
}));

const App = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });

  const [event, setEvent] = useState<Event>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const [isEventSettingsVisible, setIsEventSettingsVisible] = useState<boolean>(false);

  const AppFooter = () => (
    <div className={classes.appFooter}>
      {t('title')}
      {' '}
      <CopyrightCircleOutlined />
      {' '}
      2020-2021
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
  );

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

  useEffect(() => {
    if (event) {
      localStorage.setItem('eventID', event.id);
    }
  }, [event]);

  useEffect(() => {
    const eventID = localStorage.getItem('eventID');
    if (eventID) {
      const fetchEvent = async (myID: string) => {
        const fetchedEvent = await DataStore.query(Event, myID);
        if (fetchedEvent) {
          setEvent(fetchedEvent);
        } else {
          setIsEventSettingsVisible(true);
        }
      };
      fetchEvent(eventID);
    } else {
      setIsEventSettingsVisible(true);
    }
  }, []);

  const fetchMatches = async (eid: string) => {
    const fetchedMatches = await DataStore.query(Match, (m) => m.eventID('eq', eid));
    setMatches(fetchedMatches);
  };

  // fetch matches
  useEffect(() => {
    if (event) {
      fetchMatches(event.id);
    }
    return () => { };
  }, [event]);

  // fetch players
  useEffect(() => {
    if (!event) return () => { };

    const fetchPlayers = async (eid: string) => {
      setPlayers(await DataStore.query(Player, (p) => p.eventID('eq', eid)));
    };

    fetchPlayers(event.id);
    const subscription = DataStore.observe(Player,
      (p) => p.eventID('eq', event.id))
      .subscribe(() => {
        fetchPlayers(event.id);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [event]);

  return (
    <div className={classes.app}>
      <PageHeader
        title={(<AppTitle />)}
        extra={[
          <Button
            key={0}
            data-testid="settings"
            icon={<CloseOutlined />}
            shape="round"
            onClick={(e) => {
              setIsEventSettingsVisible(true);
              e.stopPropagation();
            }}
          />,
        ]}
      />
      <div className={classes.appContent}>
        {isEventSettingsVisible ? (
          <EventSettings
            setEvent={setEvent}
            players={players}
            setPlayers={setPlayers}
            onClose={() => setIsEventSettingsVisible(false)}
          />
        ) : <></>}
        <EventPanel
          event={event}
          matches={matches}
          fetchMatches={fetchMatches}
          players={players}
        />
      </div>
      <AppFooter />
    </div>
  );
};

export default App;
