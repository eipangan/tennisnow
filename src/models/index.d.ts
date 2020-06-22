import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum EventType {
  SINGLES_ROUND_ROBIN = "SINGLES_ROUND_ROBIN",
  DOUBLES_ROUND_ROBIN = "DOUBLES_ROUND_ROBIN",
  SINGLES_ONE_MATCH = "SINGLES_ONE_MATCH",
  DOUBLES_ONE_MATCH = "DOUBLES_ONE_MATCH",
  DEFAULT = "DEFAULT"
}

export enum MatchStatus {
  NEW = "NEW",
  PLAYER1_WON = "PLAYER1_WON",
  PLAYER2_WON = "PLAYER2_WON",
  DRAW = "DRAW"
}



export declare class Event {
  readonly id: string;
  readonly date: string;
  readonly place?: string;
  readonly type?: EventType | keyof typeof EventType;
  readonly matches?: Match[];
  readonly players?: Player[];
  readonly owner?: string;
  constructor(init: ModelInit<Event>);
  static copyOf(source: Event, mutator: (draft: MutableModel<Event>) => MutableModel<Event> | void): Event;
}

export declare class Match {
  readonly id: string;
  readonly eventID: string;
  readonly createdTime?: string;
  readonly playerIndices?: number[];
  readonly status?: MatchStatus | keyof typeof MatchStatus;
  readonly owner?: string;
  constructor(init: ModelInit<Match>);
  static copyOf(source: Match, mutator: (draft: MutableModel<Match>) => MutableModel<Match> | void): Match;
}

export declare class Player {
  readonly id: string;
  readonly eventID: string;
  readonly index: number;
  readonly name?: string;
  readonly owner?: string;
  constructor(init: ModelInit<Player>);
  static copyOf(source: Player, mutator: (draft: MutableModel<Player>) => MutableModel<Player> | void): Player;
}