import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import MatchPanel from './MatchPanel';
import { Match, MatchStatus, Player } from './models';
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
  matches: Match[];
  players: Player[];
  onAdd?: () => void;
  onDelete?: (match: Match) => void;
  onUpdate?: (match: Match, status: MatchStatus | keyof typeof MatchStatus | undefined) => void;
}

/**
 * MatchesList Component
 *
 * @param props
 */
const MatchesList = (props: MatchesListProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { matches, onAdd, onDelete } = props;
  const [isDeleteVisible, setIsDeleteVisible] = useLocalStorage<boolean>('isDeleteVisible', false);

  return (
    <div className={classes.matchesPanel}>
      <div className={classes.buttonsPanel}>
        {(() => {
          if (!onAdd) return <></>;
          return (
            <div>
              <div style={{ height: '3px' }} />
              <Button
                data-testid="add-match"
                icon={<PlusOutlined />}
                onClick={onAdd}
                shape="round"
              />
            </div>
          );
        })()}
        {(() => {
          if (!onDelete) return <></>;
          return (
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
          );
        })()}
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
              if (!onDelete || !isDeleteVisible) return <></>;
              return (
                <div>
                  <div style={{ height: '3px' }} />
                  <Button
                    icon={<DeleteOutlined />}
                    shape="circle"
                    style={{ background: '#ffffff50', color: 'darkgray' }}
                    onClick={(e) => onDelete(match)}
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
