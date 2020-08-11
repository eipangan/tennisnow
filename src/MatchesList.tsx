import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { DataStore } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { getEvent, getMatches, getNextMatch } from './EventUtils';
import MatchPanel from './MatchPanel';
import { deleteMatch, saveMatch } from './MatchUtils';
import { Event, Match } from './models';
import { ThemeType } from './Theme';
import { useLocalStorage } from './Utils';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  matchesPanel: {
    background: theme.highlightColor,
    border: '1px solid lightgray',
    display: 'flex',
    flexDirection: 'row',
    padding: '9px 15px',
  },
  buttonsPanel: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px 0px 0px 0px',
  },
  matchesList: {
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'scroll',
    margin: '0px 4px',
    width: '100%',
  },
  matchPanel: {
    margin: '0px 4px',
  },
}));

/**
 * MatchesListProps
 */
type MatchesListProps = {
  eventID: string,
}

/**
 * MatchesList Component
 *
 * @param props
 */
const MatchesList = (props: MatchesListProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { eventID } = props;

  const [event, setEvent] = useState<Event>();
  const [matches, setMatches] = useState<Match[]>([]);

  const [isDeleteVisible, setIsDeleteVisible] = useLocalStorage<boolean>('isDeleteVisible', false);

  useEffect(() => {
    const fetchEvent = async (id: string) => {
      const fetchedEvent = await getEvent(id);
      setEvent(fetchedEvent);
    };

    fetchEvent(eventID);
    const subscription = DataStore.observe(Event, eventID)
      .subscribe(() => fetchEvent(eventID));
    return () => subscription.unsubscribe();
  }, [eventID]);

  useEffect(() => {
    const fetchMatches = async (eid: string) => {
      const fetchedMatches = await getMatches(eid);
      setMatches(fetchedMatches);
    };

    fetchMatches(eventID);
    const subscription = DataStore.observe(Match,
      (m) => m.eventID('eq', eventID))
      .subscribe(() => fetchMatches(eventID));
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return (
    <div className={classes.matchesPanel}>
      <div className={classes.buttonsPanel}>
        <div>
          <div style={{ height: '3px' }} />
          <Button
            data-testid="add-match"
            icon={<PlusOutlined />}
            onClick={async () => {
              if (event) {
                const newMatch = await getNextMatch(event);
                if (newMatch) {
                  saveMatch(newMatch);
                }
              }
            }}
            shape="round"
          />
        </div>
        <div>
          <div style={{ height: '3px' }} />
          <Button
            data-testid="delete-match"
            icon={<DeleteOutlined />}
            onClick={() => setIsDeleteVisible(!isDeleteVisible)}
            shape="round"
            style={{ background: '#ffffff50', color: 'darkgray' }}
          />
        </div>
      </div>
      <div className={classes.matchesList}>
        {matches.slice(0).reverse().map((match, index) => (
          <div
            className={classes.matchPanel}
            key={index.toString()}
          >
            <MatchPanel
              key={index.toString()}
              matchID={match.id}
            />
            {(() => {
              if (!isDeleteVisible) return <></>;
              return (
                <div>
                  <div style={{ height: '3px' }} />
                  <Button
                    icon={<DeleteOutlined />}
                    shape="circle"
                    style={{ background: '#ffffff50', color: 'darkgray' }}
                    onClick={(e) => {
                      deleteMatch(match);
                    }}
                  />
                </div>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchesList;
