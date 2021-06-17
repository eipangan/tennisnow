import { CopyrightCircleOutlined, TwitterOutlined } from '@ant-design/icons';
import { PageHeader, Tag } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Route, Switch, useHistory } from 'react-router-dom';
import EventButtons from './EventButtons';
import { EventContext } from './EventContext';
import EventPanel from './EventPanel';
import useEvent from './hooks/useEvent';
import { ReactComponent as AppTitle } from './images/title.svg';
import { ThemeType } from './Theme';

const EventRoute = React.lazy(() => import('./EventRoute'));

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
  appFooter: {
    background: 'transparent',
    fontSize: 'small',
    lineHeight: '39px',
    padding: '12px 0px',
  },
}));

const App = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });
  const { event, getNextMatch } = useEvent();

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

  return (
    <div className={classes.app}>
      <div className={classes.appContent}>
        <Switch>
          <Route path="/event/:id" component={EventRoute} />
          <Route path="/">
            <EventContext.Provider
              key={event.id}
              value={{
                event,
                getNextMatch,
              }}
            >
              <PageHeader
                className={classes.appHeader}
                title={(<AppTitle />)}
                extra={[
                  <EventButtons key={event.id} />,
                ]}
              />
              <EventPanel />
            </EventContext.Provider>
          </Route>
        </Switch>
      </div>
      <div className={classes.appFooter}>
        <AppCopyright />
      </div>
    </div>
  );
};

export default App;
