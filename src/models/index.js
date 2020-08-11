// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const EventType = {
  "GENERIC_EVENT": "GENERIC_EVENT",
  "SINGLES_ROUND_ROBIN": "SINGLES_ROUND_ROBIN",
  "FIX_DOUBLES_ROUND_ROBIN": "FIX_DOUBLES_ROUND_ROBIN",
  "SWITCH_DOUBLES_ROUND_ROBIN": "SWITCH_DOUBLES_ROUND_ROBIN"
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