import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { ThemeType } from './components/utils/Theme';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  appIntro: {
    background: `${theme.bodyBackground}69`,
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

  return (
    <div className={classes.appIntro}>
      <Title className={classes.title} level={3}>
        {t('intro.welcome.title')}
      </Title>
      <Text>
        {t('intro.welcome.body')}
      </Text>
      <Title className={classes.title} level={3}>
        {t('intro.events.title')}
      </Title>
      <Text>
        {t('intro.events.body')}
      </Text>
      <Title className={classes.title} level={3}>
        {t('intro.signin.title')}
      </Title>
      <Text>
        {t('intro.signin.body')}
      </Text>
    </div>
  );
};

export default AppIntro;
