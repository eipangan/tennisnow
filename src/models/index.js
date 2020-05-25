// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const MatchStatus = {
  "NEW": "NEW",
  "TEAM1_WON": "TEAM1WON",
  "TEAM2_WON": "TEAM2WON",
  "DRAW": "DRAW"
};

const { Event, User, Player, PlayerStats, Team, Match } = initSchema(schema);

export {
  Event,
  User,
  MatchStatus,
  Player,
  PlayerStats,
  Team,
  Match
};