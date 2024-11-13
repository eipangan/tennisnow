import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { EventContext } from './EventContext';
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
      fontSize: 'medium',
      minWidth: '81px',
      whiteSpace: 'nowrap',
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
  players: Player[];
};

const MatchPanel = (props: MatchPanelProps) => {
  const { t } = useTranslation();
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });

  const { match, players } = props;
  const { fetchMatches } = useContext(EventContext);
  const [status, setStatus] = useState<keyof typeof MatchStatus>(match.status);

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

    case MatchStatus.NEW:
    default:
      player1Class = classes.matchNeutral;
      middleClass = classes.matchVs;
      middleText = t('vs');
      player2Class = classes.matchNeutral;
      break;
  }

  useEffect(() => {
    setStatus(match.status);
  }, [match.status]);

  useEffect(() => {
    if (match.status !== status) {
      saveMatch(Match.copyOf(match, (updated) => {
        updated.status = status;
      }));
      fetchMatches(match.eventID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  let player1: Player | undefined | Player[];
  let player2: Player | undefined | Player[];
  if (match.playerIndices && match.playerIndices.length === 2) {
    player1 = players.find((player) => (match.playerIndices ? player.index === match.playerIndices[0] : 0));
    player2 = players.find((player) => (match.playerIndices ? player.index === match.playerIndices[1] : 1));
  } else if (match.playerIndices && match.playerIndices.length === 4) {
    const p1 = players.find((player) => (match.playerIndices ? player.index === match.playerIndices[0] : 0));
    const p2 = players.find((player) => (match.playerIndices ? player.index === match.playerIndices[1] : 1));
    const p3 = players.find((player) => (match.playerIndices ? player.index === match.playerIndices[2] : 2));
    const p4 = players.find((player) => (match.playerIndices ? player.index === match.playerIndices[3] : 3));

    if (p1 && p2) { player1 = [p1, p2]; }
    if (p3 && p4) { player2 = [p3, p4]; }
  } else return <div />;

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
