import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum MatchStatus {
  NEW = "NEW",
  TEAM1_WON = "TEAM1WON",
  TEAM2_WON = "TEAM2WON",
  DRAW = "DRAW"
}

export declare class Player {
  readonly index: number;
  readonly userIDs?: string[];
  readonly name?: string;
  constructor(init: ModelInit<Player>);
}

export declare class Match {
  readonly index: number;
  readonly playerIndices?: number[];
  readonly status?: MatchStatus | keyof typeof MatchStatus;
  constructor(init: ModelInit<Match>);
}

export declare class Event {
  readonly id: string;
  readonly date: string;
  readonly players?: Player[];
  readonly matches?: Match[];
  readonly owner?: string;
  constructor(init: ModelInit<Event>);
  static copyOf(source: Event, mutator: (draft: MutableModel<Event>) => MutableModel<Event> | void): Event;
}