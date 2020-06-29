import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Match, MatchStatus, Player } from '../../models';
import PlayerPanel from '../player/PlayerPanel';
import { ThemeType } from '../utils/Theme';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => {
  const matchRowCommon = {
    background: 'white',
    color: 'black',
    height: theme.height,
    lineHeight: theme.height,
    outline: 'none',
    padding: '0px 12px',
    width: '100%',
  };

  return ({
    match: {
      background: theme.baseColor,
      border: '1px solid lightgray',
      borderRadius: '3px',
      display: 'flex',
      flex: 'none',
      flexDirection: 'column',
      fontSize: 'large',
      minWidth: '90px',
      margin: '0px 4px',
    },
    matchWinner: {
      ...matchRowCommon,
      background: '#fffb8f',
    },
    matchLoser: {
      ...matchRowCommon,
      color: 'lightgray',
    },
    matchNeutral: {
      ...matchRowCommon,
      color: 'black',
    },
    matchVs: {
      ...matchRowCommon,
      background: '#90ee904d',
      color: 'darkgreen',
    },
  });
});

/**
 * MatchPanelProps
 */
type MatchPanelProps = {
  match: Match;
  players: Player[];
  onUpdate?: (match: Match, status: MatchStatus | 'NEW' | 'PLAYER1_WON' | 'PLAYER2_WON' | 'DRAW' | undefined) => void;
};

/**
 * MatchPanel
 *
 * @param props
 */
const MatchPanel = (props: MatchPanelProps): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { match, players, onUpdate } = props;
  const [status, setStatus] = useState<MatchStatus | 'NEW' | 'PLAYER1_WON' | 'PLAYER2_WON' | 'DRAW' | undefined>(match.status);

  const [player1Class, setPlayer1Class] = useState(classes.matchNeutral);
  const [middleClass, setMiddleClass] = useState(classes.matchVs);
  const [middleText, setMiddleText] = useState<JSX.Element>();
  const [player2Class, setPlayer2Class] = useState(classes.matchNeutral);

  useEffect(() => {
    if (match.status) setStatus(match.status);
  }, [match.status]);

  useEffect(() => {
    switch (status) {
      case MatchStatus.PLAYER1_WON:
        setPlayer1Class(classes.matchWinner);
        setMiddleClass(classes.matchLoser);
        setMiddleText(t('draw'));
        setPlayer2Class(classes.matchLoser);
        break;

      case MatchStatus.DRAW:
        setPlayer1Class(classes.matchNeutral);
        setMiddleClass(classes.matchWinner);
        setMiddleText(t('draw'));
        setPlayer2Class(classes.matchNeutral);
        break;

      case MatchStatus.PLAYER2_WON:
        setPlayer1Class(classes.matchLoser);
        setMiddleClass(classes.matchLoser);
        setMiddleText(t('draw'));
        setPlayer2Class(classes.matchWinner);
        break;

      default:
        setPlayer1Class(classes.matchNeutral);
        setMiddleClass(classes.matchVs);
        setMiddleText(t('vs'));
        setPlayer2Class(classes.matchNeutral);
        break;
    }

    if (onUpdate) onUpdate(match, status);
  }, [classes.matchLoser, classes.matchNeutral, classes.matchVs, classes.matchWinner, match, onUpdate, status, t]);

  if (!match || !players || !match.playerIndices || match.playerIndices.length < 2) return <></>;

  const player1 = players.find((player) => (match.playerIndices ? player.index === match.playerIndices[0] : 0));
  const player2 = players.find((player) => (match.playerIndices ? player.index === match.playerIndices[1] : 1));

  return (
    <div className={classes.match}>
      <div
        className={player1Class}
        onClick={() => { setStatus(status === MatchStatus.PLAYER1_WON ? MatchStatus.NEW : MatchStatus.PLAYER1_WON); }}
        onKeyDown={() => { }}
        role="button"
        tabIndex={0}
      >
        <PlayerPanel player={player1} />
      </div>
      <div
        className={middleClass}
        onClick={() => { setStatus(status === MatchStatus.DRAW ? MatchStatus.NEW : MatchStatus.DRAW); }}
        onKeyDown={() => { }}
        role="button"
        tabIndex={0}
      >
        {middleText}
      </div>
      <div
        className={player2Class}
        onClick={() => { setStatus(status === MatchStatus.PLAYER2_WON ? MatchStatus.NEW : MatchStatus.PLAYER2_WON); }}
        onKeyDown={() => { }}
        role="button"
        tabIndex={0}
      >
        <PlayerPanel player={player2} />
      </div>
    </div>
  );
};

export default MatchPanel;
