import { Empty, List } from 'antd';
import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { ThemeType } from '../utils/Theme';
import { DeleteButton, EventType, SettingsButton } from './Event';

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
  data: EventType[];
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

  const { data } = props;
  const { events, setEvent, setIsEventSettingsVisible } = useContext(AppContext);

  const EmptyEvents = (): JSX.Element => (
    <Empty
      description={t('noEvents')}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  );

  return (
    <List
      className={classes.eventsList}
      dataSource={data}
      locale={{ emptyText: <EmptyEvents /> }}
      renderItem={(myEvent: EventType) => (
        <List.Item
          className={classes.event}
          key={myEvent.eventID}
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            setEvent(myEvent);
            history.push('/event/');
            e.stopPropagation();
          }}
          extra={[
            <DeleteButton
              key="delete"
              onConfirm={(e) => {
                if (myEvent) {
                  events.remove(myEvent.eventID);
                }
                if (e) e.stopPropagation();
              }}
            />,
            <div
              key="spacing"
              style={{ width: '12px' }}
            />,
            <SettingsButton
              key="settings"
              onClick={(e) => {
                setEvent(myEvent);
                setIsEventSettingsVisible(true);
                if (e) e.stopPropagation();
              }}
            />,
          ]}
        >
          <List.Item.Meta
            description={t('eventSummary', { numPlayers: myEvent.numPlayers })}
            title={dayjs(myEvent.date).calendar()}
          />
        </List.Item>
      )}
    />
  );
};

export default EventsList;
