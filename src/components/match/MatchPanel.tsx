import { PlayCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import React, { StrictMode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Match, MatchStatus, Player } from '../../models';
import PlayerPanel from '../player/PlayerPanel';
import { ThemeType } from '../utils/Theme';
import { saveMatch } from './MatchUtils';

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

  const { match, players } = props;

  const [status, setStatus] = useState(match ? match.status || MatchStatus.NEW : MatchStatus.NEW);
  const [team1Class, setTeam1Class] = useState(classes.matchNeutral);
  const [middleClass, setMiddleClass] = useState(classes.matchVs);
  const [middleText, setMiddleText] = useState(<PlayCircleOutlined />);
  const [team2Class, setTeam2Class] = useState(classes.matchNeutral);

  useEffect(() => {
    switch (status) {
      case MatchStatus.TEAM1_WON:
        setTeam1Class(classes.matchWinner);
        setMiddleClass(classes.matchWinner);
        setMiddleText(<TrophyOutlined />);
        setTeam2Class(classes.matchLoser);
        break;

      case MatchStatus.DRAW:
        setTeam1Class(classes.matchNeutral);
        setMiddleClass(classes.matchWinner);
        setMiddleText(t('draw'));
        setTeam2Class(classes.matchNeutral);
        break;

      case MatchStatus.TEAM2_WON:
        setTeam1Class(classes.matchLoser);
        setMiddleClass(classes.matchWinner);
        setMiddleText(<TrophyOutlined />);
        setTeam2Class(classes.matchWinner);
        break;

      default:
        setTeam1Class(classes.matchNeutral);
        setMiddleClass(classes.matchVs);
        setMiddleText(t('vs'));
        setTeam2Class(classes.matchNeutral);
        break;
    }

    if (match && match.status !== status) {
      saveMatch(Match.copyOf(match, (updatedMatch) => {
        updatedMatch.status = status;
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!match || !players) return <></>;

  const player1 = players.find((player) => (match.playerIndices ? player.index === match.playerIndices[0] : 0));
  const player2 = players.find((player) => (match.playerIndices ? player.index === match.playerIndices[1] : 1));

  return (
    <StrictMode>
      <div className={classes.match}>
        <div
          className={team1Class}
          onClick={() => { setStatus(status === MatchStatus.TEAM1_WON ? MatchStatus.NEW : MatchStatus.TEAM1_WON); }}
          onKeyDown={() => { }}
          role="button"
          tabIndex={0}
        >
          <PlayerPanel player={player1 || new Player({ index: 0 })} />
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
          className={team2Class}
          onClick={() => { setStatus(status === MatchStatus.TEAM2_WON ? MatchStatus.NEW : MatchStatus.TEAM2_WON); }}
          onKeyDown={() => { }}
          role="button"
          tabIndex={0}
        >
          <PlayerPanel player={player2 || new Player({ index: 1 })} />
        </div>
      </div>
    </StrictMode>
  );
};

export default MatchPanel;
