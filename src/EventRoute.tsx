import { PageHeader } from 'antd';
import { DataStore } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import EventButtons from './EventButtons';
import { EventContext } from './EventContext';
import EventPanel from './EventPanel';
import { getEvent } from './EventUtils';
import { ReactComponent as AppTitle } from './images/title.svg';
import { Event } from './models';
import { ThemeType } from './Theme';

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

  // get eventID from router
  const { match } = props;
  const { params } = match;
  const eventID = params.id;
  const [event, setEvent] = useState<Event>();

  useEffect(() => {
    const fetchEvent = async (id: string) => {
      const fetchedEvent = await getEvent(id);
      if (!fetchedEvent) history.push('/');
      setEvent(fetchedEvent);
    };

    fetchEvent(eventID);
    const subscription = DataStore.observe(Event, eventID)
      .subscribe(() => fetchEvent(eventID));
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventID]);

  return (
    <EventContext.Provider
      key={eventID}
      value={{
        eventID,
        event,
      }}
    >
      <PageHeader
        className={classes.appHeader}
        onBack={() => history.push('/')}
        title={(<AppTitle />)}
        extra={[
          <EventButtons key={eventID} />,
        ]}
      />
      <EventPanel />
    </EventContext.Provider>
  );
};

export default EventRoute;
