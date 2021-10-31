import { CopyrightCircleOutlined, SettingOutlined, TwitterOutlined } from '@ant-design/icons';
import { Button, PageHeader, Tag } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { EventContext } from './EventContext';
import EventPanel from './EventPanel';
import EventSettings from './EventSettings';
import useEvent from './hooks/useEvent';
import { ReactComponent as AppTitle } from './images/title.svg';
import { ThemeType } from './Theme';
import { useLocalStorage } from './utils/Utils';

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

  const [eventID, setEventID] = useLocalStorage<string>('eventID', '');
  const { event } = useEvent(eventID);

  const [isEventSettingsVisible, setIsEventSettingsVisible] = useState<boolean>(false);

  const SettingsButton = () => (
    <Button
      data-testid="settings"
      icon={<SettingOutlined />}
      shape="round"
      onClick={(e) => {
        setIsEventSettingsVisible(true);
        e.stopPropagation();
      }}
    />
  );

  const AppHeader = () => (
    <PageHeader
      title={(<AppTitle />)}
      extra={[
        <SettingsButton key={0} />,
      ]}
    />
  );

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

  return (
    <div className={classes.app}>
      <EventContext.Provider
        key={0}
        value={{
          event,
        }}
      >
        <AppHeader />
        <div className={classes.appContent}>
          {isEventSettingsVisible || !eventID ? (
            <EventSettings
              key={eventID}
              onClose={() => setIsEventSettingsVisible(false)}
              setEventID={setEventID}
            />
          ) : <></>}
          {eventID ? (
            <EventPanel />
          ) : <></>}
        </div>
        <AppFooter />
      </EventContext.Provider>
    </div>
  );
};

export default App;
