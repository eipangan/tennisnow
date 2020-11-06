import { DataStore } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Match, MatchStatus, Player } from './models';
import PlayerPanel from './PlayerPanel';
import { ThemeType } from './Theme';
import { getPlayers } from './utils/EventUtils';
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

/**
 * MatchPanelProps
 */
type MatchPanelProps = {
  matchID: string;
};

/**
 * MatchPanel
 *
 * @param props
 */
const MatchPanel = (props: MatchPanelProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const [match, setMatch] = useState<Match>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [status, setStatus] = useState<MatchStatus | keyof typeof MatchStatus>();

  const [player1Class, setPlayer1Class] = useState(classes.matchNeutral);
  const [middleClass, setMiddleClass] = useState(classes.matchVs);
  const [middleText, setMiddleText] = useState<any>();
  const [player2Class, setPlayer2Class] = useState(classes.matchNeutral);

  useEffect(() => {
    let mounted = true;
    const fetchMatch = async (eid: string) => {
      const fetchedMatch = await DataStore.query(Match, eid);
      if (mounted) {
        setMatch(fetchedMatch);

        if (fetchedMatch) {
          setStatus(fetchedMatch.status);
        }
      }
    };

    fetchMatch(props.matchID);
    return () => {
      mounted = false;
    };
  }, [props]);

  useEffect(() => {
    let mounted = true;
    const fetchPlayers = async (eid: string) => {
      const fetchedPlayers = await getPlayers(eid);
      if (mounted) {
        setPlayers(fetchedPlayers);
      }
    };

    if (!match) return () => { };
    fetchPlayers(match.eventID);
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.eventID]);

  useEffect(() => {
    // update screen
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

    // update datastore
    if (match && match.status !== status) {
      const updatedMatch = Match.copyOf(match, (updated) => {
        updated.status = status;
      });

      saveMatch(updatedMatch);
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
