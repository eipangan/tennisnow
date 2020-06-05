import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum MatchStatus {
  NEW = "NEW",
  TEAM1_WON = "TEAM1WON",
  TEAM2_WON = "TEAM2WON",
  DRAW = "DRAW"
}

export declare class Player {
  readonly index: number;
  readonly userIDs: string[];
  readonly name?: string;
  readonly stats?: Stats;
  constructor(init: ModelInit<Player>);
}

export declare class Stats {
  readonly numMatches: number;
  readonly numWon: number;
  readonly numDraws: number;
  readonly numLost: number;
  constructor(init: ModelInit<Stats>);
}

export declare class Match {
  readonly playerIndices: number[];
  readonly status: MatchStatus | keyof typeof MatchStatus;
  constructor(init: ModelInit<Match>);
}

export declare class Event {
  readonly id: string;
  readonly date: string;
  readonly players: Player[];
  readonly matches: Match[];
  readonly owner?: string;
  constructor(init: ModelInit<Event>);
  static copyOf(source: Event, mutator: (draft: MutableModel<Event>) => MutableModel<Event> | void): Event;
}