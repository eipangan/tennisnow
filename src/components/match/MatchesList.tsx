import { DeleteOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Match, MatchStatus, Player } from '../../models';
import { ThemeType } from '../utils/Theme';
import MatchPanel from './MatchPanel';

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
}));

/**
 * MatchesListProps
 */
type MatchesListProps = {
  matches: Match[];
  players: Player[];
  onAdd?: () => void;
  onDelete?: (match: Match) => void;
  onUpdate?: (match: Match, status: MatchStatus | 'NEW' | 'PLAYER1_WON' | 'PLAYER2_WON' | 'DRAW' | undefined) => void;
}

/**
 * MatchesList Component
 *
 * @param props
 */
const MatchesList = (props: MatchesListProps): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { matches, players, onUpdate, onAdd, onDelete } = props;
  const [isDeleteVisible, setIsDeleteVisible] = useState<boolean>(false);

  return (
    <div className={classes.matchesPanel}>
      {matches.map((match, index) => (
        <div key={index.toString()}>
          <MatchPanel
            key={index.toString()}
            match={match}
            players={players}
            onUpdate={onUpdate}
          />
          {(() => {
            if (!onDelete || !isDeleteVisible) return <></>;
            return (
              <div>
                <div style={{ height: '3px' }} />
                <Popconfirm
                  cancelText={t('cancel')}
                  icon={<QuestionCircleOutlined />}
                  okText={t('delete')}
                  placement="bottom"
                  title={t('deleteMatchConfirm')}
                  onCancel={(e) => {
                    if (e) e.stopPropagation();
                    setIsDeleteVisible(false);
                  }}
                  onConfirm={(e) => {
                    onDelete(match);
                    setIsDeleteVisible(false);
                  }}
                >
                  <Button
                    icon={<DeleteOutlined />}
                    shape="circle"
                    style={{ background: '#ffffff50', color: 'darkgray' }}
                  />
                </Popconfirm>
              </div>
            );
          })()}
        </div>
      ))}
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
    </div>
  );
};

export default MatchesList;
