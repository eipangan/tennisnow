/* eslint-disable react/jsx-no-constructed-context-values */
import { CopyrightCircleOutlined, TwitterOutlined } from '@ant-design/icons';
import { Button, PageHeader, Tag, Typography } from 'antd';
import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { EventContext } from './EventContext';
import EventPanel from './EventPanel';
import EventSettings from './EventSettings';
import { ReactComponent as AppTitle } from './images/title.svg';
import { Event, EventType, Match, Player } from './models';
import { ThemeType } from './Theme';
import { getNewPlayers, saveEvent, saveMatches, savePlayers } from './utils/EventUtils';

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

  useEffect(() => {
    i18n.changeLanguage(navigator.language);
  }, [i18n]);

  useEffect(() => {
    if (i18n.language.toLowerCase().startsWith('ja')) {
      dayjs.locale('ja');
    } else {
      dayjs.locale('en');
    }
    document.title = `${t('title')}`;
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
      const newEvent = new Event({
        date: dayjs().add(1, 'hour').startOf('hour').toDate()
          .toISOString(),
        type: EventType.DOUBLES_ROUND_ROBIN,
      });
      if (newEvent) {
        const numPlayers = 6;
        const oldPlayerNames: string[] = [];
        for (let p = 0; p < numPlayers; p += 1) {
          oldPlayerNames.push(String(p + 1));
        }

        const okPlayers = getNewPlayers(newEvent.id, numPlayers, oldPlayerNames);

        savePlayers(newEvent.id, okPlayers)
          .then(() => saveMatches(newEvent, okPlayers))
          .then(() => setEvent(newEvent))
          .then(() => saveEvent(newEvent))
          .then(() => setEvent(newEvent));
      } else {
        setIsEventSettingsVisible(true);
      }
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  // fetch players
  useEffect(() => {
    if (!event) return () => { };

    const fetchPlayers = async (eid: string) => {
      setPlayers(await DataStore.query(Player, (p) => p.eventID('eq', eid)));
    };

    fetchPlayers(event.id);
    const subscription = DataStore.observe(
      Player,
      (p) => p.eventID('eq', event.id),
    )
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
            shape="round"
            onClick={(e) => {
              setIsEventSettingsVisible(true);
              e.stopPropagation();
            }}
          >
            {t('newEvent')}
          </Button>,
        ]}
      />
      <Typography.Text type="secondary">
        {t('slogan')}
      </Typography.Text>
      <div className={classes.appContent}>
        {isEventSettingsVisible ? (
          <EventSettings
            event={event}
            setEvent={setEvent}
            players={players}
            setPlayers={setPlayers}
            onClose={() => setIsEventSettingsVisible(false)}
          />
        ) : <div />}
        <EventContext.Provider value={{ fetchMatches }}>
          <EventPanel
            event={event}
            matches={matches}
            players={players}
          />
        </EventContext.Provider>
      </div>
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
    </div>
  );
};

export default App;
function getUpdatedPlayers(id: any) {
  throw new Error('Function not implemented.');
}
