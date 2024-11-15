import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";

export enum EventType {
  GENERIC_EVENT = "GENERIC_EVENT",
  SINGLES_ROUND_ROBIN = "SINGLES_ROUND_ROBIN",
  FIX_DOUBLES_ROUND_ROBIN = "FIX_DOUBLES_ROUND_ROBIN",
  DOUBLES_ROUND_ROBIN = "DOUBLES_ROUND_ROBIN"
}

export enum MatchStatus {
  NEW = "NEW",
  PLAYER1_WON = "PLAYER1_WON",
  PLAYER2_WON = "PLAYER2_WON",
  DRAW = "DRAW"
}







type EagerEvent = {
  readonly id: string;
  readonly date: string;
  readonly place?: string | null;
  readonly type: EventType | keyof typeof EventType;
  readonly summary?: string | null;
  readonly details?: string | null;
  readonly matches?: (Match | null)[] | null;
  readonly players?: (Player | null)[] | null;
  readonly owner?: string | null;
}

type LazyEvent = {
  readonly id: string;
  readonly date: string;
  readonly place?: string | null;
  readonly type: EventType | keyof typeof EventType;
  readonly summary?: string | null;
  readonly details?: string | null;
  readonly matches: AsyncCollection<Match>;
  readonly players: AsyncCollection<Player>;
  readonly owner?: string | null;
}

export declare type Event = LazyLoading extends LazyLoadingDisabled ? EagerEvent : LazyEvent

export declare const Event: (new (init: ModelInit<Event>) => Event) & {
  copyOf(source: Event, mutator: (draft: MutableModel<Event>) => MutableModel<Event> | void): Event;
}

type EagerMatch = {
  readonly id: string;
  readonly eventID: string;
  readonly orderID: number;
  readonly playerIndices?: (number | null)[] | null;
  readonly status: MatchStatus | keyof typeof MatchStatus;
  readonly owner?: string | null;
}

type LazyMatch = {
  readonly id: string;
  readonly eventID: string;
  readonly orderID: number;
  readonly playerIndices?: (number | null)[] | null;
  readonly status: MatchStatus | keyof typeof MatchStatus;
  readonly owner?: string | null;
}

export declare type Match = LazyLoading extends LazyLoadingDisabled ? EagerMatch : LazyMatch

export declare const Match: (new (init: ModelInit<Match>) => Match) & {
  copyOf(source: Match, mutator: (draft: MutableModel<Match>) => MutableModel<Match> | void): Match;
}

type EagerPlayer = {
  readonly id: string;
  readonly eventID: string;
  readonly index: number;
  readonly name?: string | null;
  readonly owner?: string | null;
}

type LazyPlayer = {
  readonly id: string;
  readonly eventID: string;
  readonly index: number;
  readonly name?: string | null;
  readonly owner?: string | null;
}

export declare type Player = LazyLoading extends LazyLoadingDisabled ? EagerPlayer : LazyPlayer

export declare const Player: (new (init: ModelInit<Player>) => Player) & {
  copyOf(source: Player, mutator: (draft: MutableModel<Player>) => MutableModel<Player> | void): Player;
}