import React, { StrictMode, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { PlayerType } from '../player/Player';
import Team, {
  recordDraw, recordLoss, recordWin, TeamType, undoDraw, undoLoss, undoWin,
} from '../team/Team';
import { ThemeType } from '../utils/Theme';
import { AppContext } from '../../App';

const useStyles = createUseStyles((theme: ThemeType) => {
  const matchRowCommon = {
    height: theme.height,
    lineHeight: theme.height,
    outline: 'none',
    width: '100%',
  };

  return ({
    match: {
      background: '#FFFFFF66',
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
 * MatchStatus
 */
export enum MatchStatus {
  New,
  Team1Won,
  Team2Won,
  Draw,
}

/**
 * MatchType
 */
export interface MatchType {
  matchID: string;
  teamIDs: readonly [string, string];
  status: MatchStatus;
}

/**
 * checks if the the match have unique players
 *
 * @param t1 team1 of the match
 * @param t2 team2 of the match
 */
export const isValidMatch = (t1: TeamType, t2: TeamType): boolean => {
  if (!t1 || !t2 || !t1.playerIDs || !t2.playerIDs || t1 === t2) return false;

  let isValid = true;
  t1.playerIDs.forEach((t1pid) => {
    t2.playerIDs.forEach((t2pid) => {
      if (t1pid === t2pid) {
        isValid = false;
      }
    });
  });

  return isValid;
};

/**
 * initialize matches
 *
 * @param teams teams in the event
 */
export const getMatches = (teams: TeamType[]): MatchType[] => {
  if (!teams) return [];

  const matches = [];
  for (let t = 0; t < teams.length; t += 1) {
    for (let nt = t; nt < teams.length; nt += 1) {
      if (isValidMatch(teams[t], teams[nt])) {
        const match: MatchType = {
          matchID: String(matches.length + 1),
          teamIDs: [String(teams[t].teamID), String(teams[nt].teamID)],
          status: MatchStatus.New,
        };
        matches.push(match);
      }
    }
  }

  return matches;
};

/**
 * initialize ordered matches
 *
 * @param players players in the event
 * @param teams teams in the event
 * @param matches matches in the event
 */
export const getOrderedMatches = (
  players: PlayerType[],
  teams: TeamType[],
  matches: MatchType[],
): MatchType[] => {
  if (!matches || !teams || !players) return [];

  const orderedMatches: MatchType[] = [];
  while (orderedMatches.length < matches.length && orderedMatches.length < 12) {
    // look for players with minimum matches played
    let minPlayerMatchesPlayed = Number.MAX_VALUE;
    players.forEach((player: PlayerType) => {
      minPlayerMatchesPlayed = Math.min(minPlayerMatchesPlayed, player.stats.numMatches);
    });

    // look for teams with minimum matches played
    let minTeamMatchesPlayed = Number.MAX_VALUE;
    teams.forEach((team: TeamType) => {
      minTeamMatchesPlayed = Math.min(minTeamMatchesPlayed,
        team.stats.numMatches);
    });

    // look for matches having most of these players / teams
    let maxEligiblePlayers = 0;
    let maxEligibleTeams = 0;

    matches.forEach((match: MatchType) => {
      // check if match is already added to ordered list
      if (!orderedMatches.find((orderedMatch) => match.matchID === orderedMatch.matchID)) {
        let matchEligiblePlayers = 0;
        let matchEligibleTeams = 0;

        match.teamIDs.forEach((tid: string) => {
          const team: TeamType | undefined = teams.find(({ teamID }) => teamID === tid);
          if (team) {
            if (team.stats.numMatches === minTeamMatchesPlayed) {
              matchEligibleTeams += 1;
            }

            team.playerIDs.forEach((pid: string) => {
              const player: PlayerType | undefined = players.find(
                ({ playerID }) => playerID === pid,
              );
              if (player && player.stats.numMatches === minPlayerMatchesPlayed) {
                matchEligiblePlayers += 1;
              }
            });
          }
        });
        maxEligiblePlayers = Math.max(maxEligiblePlayers, matchEligiblePlayers);
        maxEligibleTeams = Math.max(maxEligibleTeams, matchEligibleTeams);
      }
    });

    // add match to ordered list
    let eligibleMatchId: string | undefined;
    // eslint-disable-next-line no-restricted-syntax
    for (const match of matches) {
      // check if match is already added to ordered list
      if (!orderedMatches.find((orderedMatch) => match.matchID === orderedMatch.matchID)) {
        let matchEligiblePlayers = 0;
        let matchEligibleTeams = 0;

        // eslint-disable-next-line no-loop-func
        match.teamIDs.forEach((tid: string) => {
          const team = teams.find(({ teamID }) => teamID === tid);
          if (team) {
            if (team.stats.numMatches === minTeamMatchesPlayed) {
              matchEligibleTeams += 1;
            }

            team.playerIDs
              .forEach((pid: string) => {
                const player: PlayerType | undefined = players.find(
                  ({ playerID }) => playerID === pid,
                );
                if (player && player.stats.numMatches === minPlayerMatchesPlayed) {
                  matchEligiblePlayers += 1;
                }
              });
          }
        });

        if (maxEligiblePlayers === matchEligiblePlayers) {
          if (eligibleMatchId === undefined && maxEligibleTeams === matchEligibleTeams) {
            eligibleMatchId = match.matchID;
            break;
          } else if (eligibleMatchId === undefined) {
            eligibleMatchId = match.matchID;
          } else if (maxEligibleTeams === matchEligibleTeams) {
            eligibleMatchId = match.matchID;
            break;
          }
        }
      }
    }

    matches.filter((match: MatchType) => match.matchID === eligibleMatchId)
      .forEach((match: MatchType) => {
        match.teamIDs.forEach((tid) => {
          const team: TeamType | undefined = teams.find(
            ({ teamID }) => teamID === tid,
          );
          if (team) {
            team.stats.numMatches += 1;
            team.playerIDs.forEach((pid) => {
              const player: PlayerType | undefined = players.find(
                ({ playerID }) => playerID === pid,
              );
              if (player) {
                player.stats.numMatches += 1;
              }
            });
          }
        });
        orderedMatches.push(match);
      });
  }

  return orderedMatches;
};

/**
 * MatchProps
 */
type MatchProps = {
  match: MatchType;
  onUpdate: () => void;
};

/**
 * Match
 *
 * @param props
 */
const Match = (props: MatchProps): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { match, onUpdate } = props;
  const { event } = useContext(AppContext);
  const { teams, players } = event;

  const handleClick = (newStatus: MatchStatus) => {
    const team1 = teams.find(({ teamID }) => teamID === match.teamIDs[0]);
    const team2 = teams.find(({ teamID }) => teamID === match.teamIDs[1]);

    if (!team1 || !team2) return;

    // undo previous status
    switch (match.status) {
      case MatchStatus.Team1Won:
        undoWin(team1, players);
        undoLoss(team2, players);
        break;

      case MatchStatus.Team2Won:
        undoWin(team2, players);
        undoLoss(team1, players);
        break;

      case MatchStatus.Draw:
        undoDraw(team1, players);
        undoDraw(team2, players);
        break;

      default:
    }

    if (match.status === newStatus) {
      match.status = MatchStatus.New;
    } else {
      match.status = newStatus;

      // update to new status
      switch (newStatus) {
        case MatchStatus.Team1Won:
          recordWin(team1, players);
          recordLoss(team2, players);
          break;

        case MatchStatus.Team2Won:
          recordWin(team2, players);
          recordLoss(team1, players);
          break;

        case MatchStatus.Draw:
          recordDraw(team1, players);
          recordDraw(team2, players);
          break;

        default:
      }
    }

    // update screen
    onUpdate();
  };

  if (!match || !teams || !players) return <></>;

  return (
    <StrictMode>
      <div className={classes.match}>
        {(() => {
          if (!match.teamIDs) return <></>;

          const team1: TeamType | undefined = teams.find(
            ({ teamID }) => teamID === match.teamIDs[0],
          );
          const team2: TeamType | undefined = teams.find(
            ({ teamID }) => teamID === match.teamIDs[1],
          );

          if (!team1 || !team2) return <></>;

          return (
            <>
              {((matchStatus: MatchStatus): JSX.Element => {
                switch (matchStatus) {
                  case MatchStatus.Team1Won:
                    return (
                      <>
                        <Team
                          team={team1}
                          onClick={(e) => {
                            handleClick(MatchStatus.Team1Won);
                            e.stopPropagation();
                          }}
                          state="won"
                        />
                        <div
                          className={classes.matchRowDrawInactive}
                          onClick={(e) => {
                            handleClick(MatchStatus.Draw);
                            e.stopPropagation();
                          }}
                          onKeyDown={() => { }}
                          role="button"
                          tabIndex={0}
                        >
                          {t('draw')}
                        </div>
                        <Team
                          team={team2}
                          onClick={(e) => {
                            handleClick(MatchStatus.Team2Won);
                            e.stopPropagation();
                          }}
                          state="lost"
                        />
                      </>
                    );

                  case MatchStatus.Team2Won:
                    return (
                      <>
                        <Team
                          team={team1}
                          onClick={(e) => {
                            handleClick(MatchStatus.Team1Won);
                            e.stopPropagation();
                          }}
                          state="lost"
                        />
                        <div
                          className={classes.matchRowDrawInactive}
                          onClick={(e) => {
                            handleClick(MatchStatus.Draw);
                            e.stopPropagation();
                          }}
                          onKeyDown={() => { }}
                          role="button"
                          tabIndex={0}
                        >
                          {t('draw')}
                        </div>
                        <Team
                          team={team2}
                          onClick={(e) => {
                            handleClick(MatchStatus.Team2Won);
                            e.stopPropagation();
                          }}
                          state="won"
                        />
                      </>
                    );

                  case MatchStatus.Draw:
                    return (
                      <>
                        <Team
                          team={team1}
                          onClick={(e) => {
                            handleClick(MatchStatus.Team1Won);
                            e.stopPropagation();
                          }}
                          state="draw"
                        />
                        <div
                          className={classes.matchRowDrawActive}
                          onClick={(e) => {
                            handleClick(MatchStatus.Draw);
                            e.stopPropagation();
                          }}
                          onKeyDown={() => { }}
                          role="button"
                          tabIndex={0}
                        >
                          {t('draw')}
                        </div>
                        <Team
                          team={team2}
                          onClick={(e) => {
                            handleClick(MatchStatus.Team2Won);
                            e.stopPropagation();
                          }}
                          state="draw"
                        />
                      </>
                    );

                  case MatchStatus.New:
                  default:
                    return (
                      <>
                        <Team
                          team={team1}
                          onClick={(e) => {
                            handleClick(MatchStatus.Team1Won);
                            e.stopPropagation();
                          }}
                        />
                        <div
                          className={classes.matchRowVs}
                          onClick={(e) => {
                            handleClick(MatchStatus.Draw);
                            e.stopPropagation();
                          }}
                          onKeyDown={() => { }}
                          role="button"
                          tabIndex={0}
                        >
                          {t('vs')}
                        </div>
                        <Team
                          team={team2}
                          onClick={(e) => {
                            handleClick(MatchStatus.Team2Won);
                            e.stopPropagation();
                          }}
                        />
                      </>
                    );
                }
              })(match.status)}
            </>
          );
        })()}
      </div>
    </StrictMode>
  );
};

export default Match;
