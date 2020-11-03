import { PageHeader } from 'antd';
import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import EventButtons from './EventButtons';
import { EventContext } from './EventContext';
import EventPanel from './EventPanel';
import useEvent from './hooks/useEvent';
import { ReactComponent as AppTitle } from './images/title.svg';
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
const EventRoute = (props: any) => {
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles({ theme });

  // get event
  const { match } = props;
  const { params } = match;
  const { id } = params;
  const { event, getNextMatch } = useEvent(id);

  if (!event) return <></>;
  return (
    <EventContext.Provider
      key={event.id}
      value={{
        event,
        getNextMatch,
      }}
    >
      <PageHeader
        className={classes.appHeader}
        onBack={() => history.push('/')}
        title={(<AppTitle />)}
        extra={[
          <EventButtons key={event.id} />,
        ]}
      />
      <EventPanel />
    </EventContext.Provider>
  );
};

export default EventRoute;
