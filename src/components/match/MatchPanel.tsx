import React, { StrictMode } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Match, MatchStatus } from '../../models';
import TeamPanel from '../team/TeamPanel';
import { ThemeType } from '../utils/Theme';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => {
  const matchRowCommon = {
    height: theme.height,
    lineHeight: theme.height,
    outline: 'none',
    width: '100%',
  };

  return ({
    match: {
      background: theme.baseColor,
      border: '1px solid lightgray',
      borderRadius: '3px',
      color: 'black',
      display: 'flex',
      flex: 'none',
      flexDirection: 'column',
      fontSize: 'x-large',
      width: '90px',
      margin: '0px 4px',
    },
    matchWinner: {
      ...matchRowCommon,
      background: theme.match.won.background,
      color: 'darkbrown',
      fontSize: 'large',
    },
    matchOthers: {
      ...matchRowCommon,
      background: theme.match.draw.background,
      color: theme.match.draw.color,
      fontSize: 'large',
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
  onUpdate?: () => void;
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

  const { match } = props;

  const team1 = match.teams[0];
  const team2 = match.teams[1];
  const { status } = match;

  let team1Class = classes.matchOthers;
  let middleClass = classes.matchVs;
  let middleText = t('vs');
  let team2Class = classes.matchOthers;

  switch (status) {
    case MatchStatus.TEAM1_WON:
      team1Class = classes.matchWinner;
      middleClass = classes.matchOthers;
      middleText = t('draw');
      team2Class = classes.matchOthers;
      break;

    default:
      break;
  }

  return (
    <StrictMode>
      <div className={classes.match}>
        <TeamPanel
          team={team1}
          className={team1Class}
        />
        <div
          className={middleClass}
          onKeyDown={() => { }}
          role="button"
          tabIndex={0}
        >
          {middleText}
        </div>
        <TeamPanel
          team={team2}
          className={team2Class}
        />
      </div>
    </StrictMode>
  );
};

export default MatchPanel;
