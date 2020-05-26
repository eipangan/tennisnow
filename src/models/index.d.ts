import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum MatchStatus {
  NEW = "NEW",
  TEAM1_WON = "TEAM1WON",
  TEAM2_WON = "TEAM2WON",
  DRAW = "DRAW"
}

export declare class Player {
  readonly id: string;
  readonly stats: PlayerStats;
  readonly user?: User;
  constructor(init: ModelInit<Player>);
}

export declare class PlayerStats {
  readonly numMatches: number;
  readonly numWon: number;
  readonly numDraws: number;
  readonly numLost: number;
  constructor(init: ModelInit<PlayerStats>);
}

export declare class Team {
  readonly id: string;
  readonly players: Player[];
  readonly stats: PlayerStats;
  constructor(init: ModelInit<Team>);
}

export declare class Match {
  readonly id: string;
  readonly teams: Team[];
  readonly status?: MatchStatus | keyof typeof MatchStatus;
  constructor(init: ModelInit<Match>);
}

export declare class Event {
  readonly id: string;
  readonly date: string;
  readonly numPlayers: number;
  readonly players: Player[];
  readonly teams: Team[];
  readonly matches: Match[];
  readonly orderedMatches: Match[];
  constructor(init: ModelInit<Event>);
  static copyOf(source: Event, mutator: (draft: MutableModel<Event>) => MutableModel<Event> | void): Event;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  constructor(init: ModelInit<User>);
  static copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}