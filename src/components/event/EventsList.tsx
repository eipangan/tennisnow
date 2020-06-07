import { List, Typography } from 'antd';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import { ReactComponent as Empty } from '../../images/empty.svg';
import { Event } from '../../models';
import { ThemeType } from '../utils/Theme';
import EventButtons from './EventButtons';

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
      renderItem={(myEvent: Event) => (
        <List.Item
          className={classes.event}
          key={myEvent.id}
          onClick={(e) => {
            history.push(`/event/${myEvent.id}`);
            e.stopPropagation();
          }}
          extra={[
            <EventButtons
              key="settings"
              event={myEvent}
            />,
          ]}
        >
          <List.Item.Meta
            description={t('eventSummary', { numPlayers: myEvent.players ? myEvent.players.length : 0 })}
            title={dayjs(myEvent.date).calendar()}
          />
        </List.Item>
      )}
    />
  );
};

export default EventsList;
