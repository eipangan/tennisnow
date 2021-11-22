import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Match, MatchStatus, Player } from './models';
import PlayerPanel from './PlayerPanel';
import { ThemeType } from './Theme';
import { saveMatch } from './utils/MatchUtils';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => {
  const matchRowCommon = {
    background: 'white',
    color: 'black',
    height: theme.height,
    lineHeight: theme.height,
    outline: 'none',
    padding: '0px 9px',
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

type MatchPanelProps = {
  match: Match;
  fetchMatches: (eventID: string) => void;
  players: Player[];
};

const MatchPanel = (props: MatchPanelProps) => {
  const { t } = useTranslation();
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });

  const { match, fetchMatches, players } = props;
  const [status, setStatus] = useState<MatchStatus | keyof typeof MatchStatus>(match.status);

  let player1Class: string;
  let middleClass: string;
  let middleText: string;
  let player2Class: string;

  switch (match.status) {
    case MatchStatus.PLAYER1_WON:
      player1Class = classes.matchWinner;
      middleClass = classes.matchLoser;
      middleText = t('draw');
      player2Class = classes.matchLoser;
      break;

    case MatchStatus.DRAW:
      player1Class = classes.matchNeutral;
      middleClass = classes.matchWinner;
      middleText = t('draw');
      player2Class = classes.matchNeutral;
      break;

    case MatchStatus.PLAYER2_WON:
      player1Class = classes.matchLoser;
      middleClass = classes.matchLoser;
      middleText = t('draw');
      player2Class = classes.matchWinner;
      break;

    default:
      player1Class = classes.matchNeutral;
      middleClass = classes.matchVs;
      middleText = t('vs');
      player2Class = classes.matchNeutral;
      break;
  }

  useEffect(() => {
    if (match.status !== status) {
      saveMatch(Match.copyOf(match, (updated) => {
        updated.status = status;
      }));
      fetchMatches(match.eventID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!match || !players || !match.playerIndices || match.playerIndices.length < 2) return <></>;
  const player1 = players.find((player) => (match.playerIndices ? player.index === match.playerIndices[0] : 0));
  const player2 = players.find((player) => (match.playerIndices ? player.index === match.playerIndices[1] : 1));

  return (
    <div className={classes.match}>
      <div
        data-testid="player1"
        className={player1Class}
        onClick={() => { setStatus(status === MatchStatus.PLAYER1_WON ? MatchStatus.NEW : MatchStatus.PLAYER1_WON); }}
        onKeyDown={() => { }}
        role="button"
        tabIndex={0}
      >
        <PlayerPanel player={player1} />
      </div>
      <div
        data-testid="middle"
        className={middleClass}
        onClick={() => { setStatus(status === MatchStatus.DRAW ? MatchStatus.NEW : MatchStatus.DRAW); }}
        onKeyDown={() => { }}
        role="button"
        tabIndex={0}
      >
        {middleText}
      </div>
      <div
        data-testid="player2"
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
