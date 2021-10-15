import { DeleteOutlined, MoreOutlined, UpOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { EventContext } from './EventContext';
import MatchPanel from './MatchPanel';
import { Match } from './models';
import { ThemeType } from './Theme';
import { deleteMatch } from './utils/MatchUtils';
import { useLocalStorage } from './utils/Utils';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  matchesPanel: {
    background: theme.highlightColor,
    border: '1px solid lightgray',
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'scroll',
    padding: '9px 15px',
  },
  buttonsPanel: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px 15px 0px 0px',
  },
  matchPanel: {
    margin: '0px 4px',
  },
}));

/**
 * MatchesList Component
 *
 * @param props
 */
const MatchesList = () => {
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });

  const { event } = useContext(EventContext);
  const [matches, setMatches] = useState<Match[]>([]);

  const [isDeleteVisible, setIsDeleteVisible] = useLocalStorage<boolean>('isDeleteVisible', false);

  // whenever event change, re-fetch/re-initalize matches
  useEffect(() => {
    if (!event) return () => { };

    let mounted = true;
    const fetchMatches = async (eid: string) => {
      const fetchedMatches = await DataStore.query(Match, (m) => m.eventID('eq', eid));
      if (mounted) {
        setMatches(fetchedMatches);
      }
    };

    fetchMatches(event.id);
    const subscription = DataStore.observe(Match,
      (m) => m.eventID('eq', event.id))
      .subscribe(() => fetchMatches(event.id));

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return (
    <div className={classes.matchesPanel}>
      {matches
        .sort((a: Match, b: Match) => (dayjs(a.createdTime).isBefore(dayjs(b.createdTime)) ? -1 : 1))
        .map((match, index) => (
          <div
            className={classes.matchPanel}
            key={index.toString()}
          >
            <MatchPanel matchID={match.id} />
            {(() => {
              if (!isDeleteVisible) return <></>;
              return (
                <>
                  <div style={{ height: '3px' }} />
                  <Button
                    data-testid="delete-match"
                    icon={<DeleteOutlined />}
                    shape="circle"
                    style={{ background: '#ffffff50', color: '#ff696996' }}
                    onClick={(e) => {
                      deleteMatch(match);
                    }}
                  />
                </>
              );
            })()}
          </div>
        ))}
      <div className={classes.buttonsPanel}>
        <div style={{ height: '3px' }} />
        <Button
          data-testid="more"
          icon={isDeleteVisible ? <UpOutlined /> : <MoreOutlined />}
          onClick={() => setIsDeleteVisible(!isDeleteVisible)}
          shape="round"
        />
      </div>
    </div>
  );
};

export default MatchesList;
