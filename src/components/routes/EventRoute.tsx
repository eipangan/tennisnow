import { PageHeader } from 'antd';
import { DataStore } from 'aws-amplify';
import React, { Suspense, useContext, useEffect } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { ReactComponent as AppTitle } from '../../images/title.svg';
import { Event } from '../../models';
import EventPanel, { DeleteButton } from '../event/EventPanel';
import { EventSettingsButton } from '../event/EventSettings';
import { getNewEvent } from '../event/EventUtils';
import { ThemeType } from '../utils/Theme';

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
  const { event, setEvent, setIsEventSettingsVisible } = useContext(AppContext);

  const fetchEvent = async (id: string) => {
    const myEvent = await DataStore.query(Event, id);
    setEvent(myEvent);
  };

  useEffect(() => {
    fetchEvent(match.params.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
                setEvent(getNewEvent());

                DataStore.delete(event);
                history.push('/');

                e.stopPropagation();
              }
            }}
          />,
          <EventSettingsButton
            key="settings"
            onClick={(e) => {
              setEvent(event);
              setIsEventSettingsVisible(true);

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

export default EventRoute;
