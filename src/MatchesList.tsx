import { DeleteOutlined, MoreOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { EventContext } from './EventContext';
import { getMatches } from './EventUtils';
import MatchPanel from './MatchPanel';
import { deleteMatch, saveMatch } from './MatchUtils';
import { Match } from './models';
import { ThemeType } from './Theme';
import { useLocalStorage } from './Utils';

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
const MatchesList = (): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { event, getNextMatch } = useContext(EventContext);
  const [matches, setMatches] = useState<Match[]>([]);

  const [isDeleteVisible, setIsDeleteVisible] = useLocalStorage<boolean>('isDeleteVisible', false);

  useEffect(() => {
    const fetchMatches = async (eid: string) => {
      const fetchedMatches = await getMatches(eid);
      setMatches(fetchedMatches);
    };

    if (!event) return () => {};
    fetchMatches(event.id);
    const subscription = DataStore.observe(Match,
      (m) => m.eventID('eq', event.id))
      .subscribe(() => fetchMatches(event.id));
    return () => subscription.unsubscribe();
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
          data-testid="add-match"
          icon={<PlusOutlined />}
          onClick={async () => {
            if (event && getNextMatch) {
              const newMatch = await getNextMatch();
              if (newMatch) {
                saveMatch(newMatch);
              }
            }
          }}
          shape="round"
        />
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
