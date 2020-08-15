import { List, Typography } from 'antd';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import EventButtons from './EventButtons';
import { EventContext } from './EventContext';
import { ReactComponent as Empty } from './images/empty.svg';
import { Event } from './models';
import { ThemeType } from './Theme';

// initialize dayjs
dayjs.extend(calendar);

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  eventsList: {
    background: 'transparent',
  },
  event: {
    background: `${theme.baseColor}90`,
    margin: '0px 0px',
    padding: '12px',
    textAlign: 'left',
  },
}));

/**
 * EventsListProps
 *
 * @param props
 */
type EventsListProps = {
  events: Event[];
};

/**
 * EventsList Component
 *
 * @param props
 */
const EventsList = (props: EventsListProps): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { events } = props;

  const EmptyEvents = (): JSX.Element => (
    <>
      <Empty width="60%" height="80%" style={{ maxWidth: 300 }} />
      <Typography>
        {t('noEvents')}
      </Typography>
    </>
  );

  return (
    <List
      className={classes.eventsList}
      dataSource={events}
      locale={{ emptyText: <EmptyEvents /> }}
      renderItem={(event: Event) => (
        <List.Item
          className={classes.event}
          key={event.id}
          onClick={(e) => {
            history.push(`/event/${event.id}`);
            e.stopPropagation();
          }}
          extra={[
            <EventContext.Provider
              key={event.id}
              value={{ event }}
            >
              <EventButtons />
            </EventContext.Provider>,
          ]}
        >
          <List.Item.Meta
            description={event.summary}
            title={dayjs(event.date).calendar()}
          />
        </List.Item>
      )}
    />
  );
};

export default EventsList;
