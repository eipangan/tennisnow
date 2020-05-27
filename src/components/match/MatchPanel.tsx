import React, { StrictMode, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { AppContext } from '../../AppContext';
import { MatchStatus, Team, Match } from '../../models';
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
    matchRowDrawActive: {
      ...matchRowCommon,
      background: theme.match.won.background,
      color: 'darkbrown',
      fontSize: 'large',
    },
    matchRowDrawInactive: {
      ...matchRowCommon,
      background: theme.match.draw.background,
      color: theme.match.draw.color,
      fontSize: 'large',
    },
    matchRowVs: {
      ...matchRowCommon,
      background: '#90ee904d',
      color: 'darkgreen',
    },
  });
});

/**
 * MatchProps
 */
type MatchProps = {
  match: Match;
  onUpdate?: () => void;
};

/**
 * Match
 *
 * @param props
 */
const MatchPanel = (props: MatchProps): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { match } = props;

  const team1 = match.teams[0];
  const team2 = match.teams[1];
  const { status } = match;

  let team1Class = classes.matchRowDrawInactive;
  let middleClass = classes.matchRowVs;
  let middleText = t('vs');
  let team2Class = classes.matchRowDrawInactive;

  switch (status) {
    case MatchStatus.TEAM1_WON:
      team1Class = classes.matchRowDrawActive;
      middleClass = classes.matchRowDrawInactive;
      middleText = t('draw');
      team2Class = classes.matchRowDrawInactive;
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
          className={classes.matchRowDrawInactive}
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
