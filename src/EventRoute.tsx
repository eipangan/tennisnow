import { PageHeader } from 'antd';
import React, { Suspense, useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import EventButtons from './EventButtons';
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

  const [event, setEvent] = useState<Event>();
  const { match } = props;
  const { params } = match;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Loader
   */
  const Loader = (): JSX.Element => {
    if (!isLoading) return <></>;
    return (
      <div className="loader" />
    );
  };

  useEffect(() => {
    const fetchEvent = async (id: string) => {
      setIsLoading(true);
      const myEvent = await getEvent(id);
      setEvent(myEvent);
      setIsLoading(false);
    };

    fetchEvent(params.id);
  }, [params.id]);

  if (!event) {
    return (
      <PageHeader
        className={classes.appHeader}
        onBack={() => history.push('/')}
        title={(<AppTitle />)}
      />
    );
  }

  return (
    <>
      <Loader />
      <PageHeader
        className={classes.appHeader}
        onBack={() => history.push('/')}
        title={(<AppTitle />)}
        extra={[
          <EventButtons
            key="settings"
            eventID={event.id}
          />,
        ]}
      />
      <Suspense fallback={<div className="loader" />}>
        <EventPanel eventID={event.id} />
      </Suspense>
    </>
  );
};

export default EventRoute;
