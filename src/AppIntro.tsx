import { Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { getNewEvent, getNewPlayers, getNextMatch } from './components/event/EventUtils';
import MatchesList from './components/match/MatchesList';
import { ThemeType } from './components/utils/Theme';
import { ReactComponent as Signup } from './images/signup.svg';
import { ReactComponent as Tennis } from './images/tennis.svg';
import { Match } from './models';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  appIntro: {
    background: `${theme.baseColor}69`,
    margin: theme.margin,
    padding: '12px',
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

  const event = getNewEvent();
  const players = getNewPlayers(event.id, 6, ['1', '2', '3', '4', '5', '6']);

  const [matches, setMatches] = useState<Match[]>();
  useEffect(() => {
    const getMatches = async () : Promise<Match[]> => {
      const match = await getNextMatch(event.id, matches, players);
      if (match) return ([match]);
      return [];
    };

    getMatches()
      .then((myMatches) => {
        if (myMatches) {
          setMatches(myMatches);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <MatchesList
        matches={matches || []}
        players={players || []}
      />
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
