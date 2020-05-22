import { Typography } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { AppContext, AppContextType } from './AppContext';
import { EventType, getNewEvent } from './components/event/Event';
import MatchesPanel from './components/match/MatchesPanel';
import { ThemeType } from './components/utils/Theme';
import { ReactComponent as Signup } from './images/signup.svg';
import { ReactComponent as Tennis } from './images/tennis.svg';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  appIntro: {
    background: `${theme.baseColor}69`,
    padding: '12px',
    margin: '12px',
  },
  title: {
    background: 'transparent',
  },
}));

/**
 * AppIntro
 */
const AppIntro = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { Title, Text } = Typography;
  const [event, setEvent] = useState<EventType>(getNewEvent());

  const app: AppContextType = {
    events: {
      add: (myEvent: EventType): boolean => true,
      get: (eventID: string | undefined): EventType | undefined => undefined,
      update: (myEvent: EventType): boolean => true,
      remove: (eventID: string | undefined): boolean => true,
    },
    event,
    setEvent,
    isEventSettingsVisible: true,
    setIsEventSettingsVisible: () => { },
    isUserSettingsVisible: false,
    setIsUserSettingsVisible: () => { },
  };

  return (
    <div className={classes.appIntro}>
      <Title className={classes.title} level={3}>
        {t('intro.welcome.title')}
      </Title>
      <Text>
        {t('slogan')}
      </Text>
      <div style={{ margin: '12px 0px' }}>
        <Tennis width="60%" height="80%" style={{ maxWidth: 300 }} />
      </div>
      <Title className={classes.title} level={3}>
        {t('intro.events.title')}
      </Title>
      <Text>
        {t('intro.events.body1')}
      </Text>
      <div style={{ margin: '12px 0px' }}>
        <AppContext.Provider value={app}>
          <MatchesPanel
            data={app.event.orderedMatches}
            onUpdate={() => { if (event) setEvent({ ...event }); }}
          />
        </AppContext.Provider>
      </div>
      <Text>
        {t('intro.events.body2')}
      </Text>
      <Title className={classes.title} level={3}>
        {t('intro.signin.title')}
      </Title>
      <Text>
        {t('intro.signin.body')}
      </Text>
      <div style={{ margin: '12px 0px' }}>
        <Signup width="60%" height="80%" style={{ maxWidth: 300 }} />
      </div>
    </div>
  );
};

export default AppIntro;
