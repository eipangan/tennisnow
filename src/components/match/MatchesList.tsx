import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Match, MatchStatus, Player } from '../../models';
import { ThemeType } from '../utils/Theme';
import MatchPanel from './MatchPanel';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  matchesPanel: {
    alignItems: 'center',
    background: theme.highlightColor,
    border: '1px solid lightgray',
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'scroll',
    padding: '9px 15px',
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

  return (
    <div className={classes.matchesPanel}>
      {matches.map((match, index) => (
        <MatchPanel
          key={index.toString()}
          match={match}
          players={players}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
      <div style={{ padding: '0px 15px 0px 0px' }}>
        <Button
          data-testid="add-match"
          icon={<PlusOutlined />}
          onClick={onAdd}
        >
          {t('newMatch')}
        </Button>
      </div>
    </div>
  );
};

export default MatchesList;
