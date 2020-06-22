// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const EventType = {
  "SINGLES_ROUND_ROBIN": "SINGLES_ROUND_ROBIN",
  "DOUBLES_ROUND_ROBIN": "DOUBLES_ROUND_ROBIN",
  "SINGLES_ONE_MATCH": "SINGLES_ONE_MATCH",
  "DOUBLES_ONE_MATCH": "DOUBLES_ONE_MATCH",
  "DEFAULT": "DEFAULT"
};

const MatchStatus = {
  "NEW": "NEW",
  "PLAYER1_WON": "PLAYER1_WON",
  "PLAYER2_WON": "PLAYER2_WON",
  "DRAW": "DRAW"
};

const { Event, Match, Player } = initSchema(schema);

export {
  Event,
  Match,
  Player,
  EventType,
  MatchStatus
};