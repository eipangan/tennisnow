/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateEventInput = {
  id?: string | null,
  date: number,
  numPlayers: number,
  players: Array< PlayerInput >,
  teams: Array< TeamInput >,
  matches: Array< MatchInput >,
  orderedMatches: Array< MatchInput >,
  _version?: number | null,
};

export type PlayerInput = {
  id: string,
  stats: PlayerStatsInput,
};

export type PlayerStatsInput = {
  numMatches: number,
  numWon: number,
  numDraws: number,
  numLost: number,
};

export type TeamInput = {
  id: string,
  players: Array< PlayerInput >,
  stats: PlayerStatsInput,
};

export type MatchInput = {
  id: string,
  teams: Array< TeamInput >,
  status?: MatchStatus | null,
};

export enum MatchStatus {
  NEW = "NEW",
  TEAM1WON = "TEAM1WON",
  TEAM2WON = "TEAM2WON",
  DRAW = "DRAW",
}


export type ModelEventConditionInput = {
  date?: ModelIntInput | null,
  numPlayers?: ModelIntInput | null,
  and?: Array< ModelEventConditionInput | null > | null,
  or?: Array< ModelEventConditionInput | null > | null,
  not?: ModelEventConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type UpdateEventInput = {
  id: string,
  date?: number | null,
  numPlayers?: number | null,
  players?: Array< PlayerInput > | null,
  teams?: Array< TeamInput > | null,
  matches?: Array< MatchInput > | null,
  orderedMatches?: Array< MatchInput > | null,
  _version?: number | null,
};

export type DeleteEventInput = {
  id?: string | null,
  _version?: number | null,
};

export type CreateUserInput = {
  id?: string | null,
  name: string,
  _version?: number | null,
};

export type ModelUserConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type UpdateUserInput = {
  id: string,
  name?: string | null,
  _version?: number | null,
};

export type DeleteUserInput = {
  id?: string | null,
  _version?: number | null,
};

export type ModelEventFilterInput = {
  id?: ModelIDInput | null,
  date?: ModelIntInput | null,
  numPlayers?: ModelIntInput | null,
  and?: Array< ModelEventFilterInput | null > | null,
  or?: Array< ModelEventFilterInput | null > | null,
  not?: ModelEventFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type CreateEventMutationVariables = {
  input: CreateEventInput,
  condition?: ModelEventConditionInput | null,
};

export type CreateEventMutation = {
  createEvent:  {
    __typename: "Event",
    id: string,
    date: number,
    numPlayers: number,
    players:  Array< {
      __typename: "Player",
      id: string,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
      user:  {
        __typename: "User",
        id: string,
        name: string,
        _version: number,
        _deleted: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner: string | null,
      } | null,
    } >,
    teams:  Array< {
      __typename: "Team",
      id: string,
      players:  Array< {
        __typename: "Player",
        id: string,
      } >,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
    } >,
    matches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    orderedMatches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type UpdateEventMutationVariables = {
  input: UpdateEventInput,
  condition?: ModelEventConditionInput | null,
};

export type UpdateEventMutation = {
  updateEvent:  {
    __typename: "Event",
    id: string,
    date: number,
    numPlayers: number,
    players:  Array< {
      __typename: "Player",
      id: string,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
      user:  {
        __typename: "User",
        id: string,
        name: string,
        _version: number,
        _deleted: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner: string | null,
      } | null,
    } >,
    teams:  Array< {
      __typename: "Team",
      id: string,
      players:  Array< {
        __typename: "Player",
        id: string,
      } >,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
    } >,
    matches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    orderedMatches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type DeleteEventMutationVariables = {
  input: DeleteEventInput,
  condition?: ModelEventConditionInput | null,
};

export type DeleteEventMutation = {
  deleteEvent:  {
    __typename: "Event",
    id: string,
    date: number,
    numPlayers: number,
    players:  Array< {
      __typename: "Player",
      id: string,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
      user:  {
        __typename: "User",
        id: string,
        name: string,
        _version: number,
        _deleted: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner: string | null,
      } | null,
    } >,
    teams:  Array< {
      __typename: "Team",
      id: string,
      players:  Array< {
        __typename: "Player",
        id: string,
      } >,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
    } >,
    matches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    orderedMatches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser:  {
    __typename: "User",
    id: string,
    name: string,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser:  {
    __typename: "User",
    id: string,
    name: string,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser:  {
    __typename: "User",
    id: string,
    name: string,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type SyncEventsQueryVariables = {
  filter?: ModelEventFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncEventsQuery = {
  syncEvents:  {
    __typename: "ModelEventConnection",
    items:  Array< {
      __typename: "Event",
      id: string,
      date: number,
      numPlayers: number,
      players:  Array< {
        __typename: "Player",
        id: string,
      } >,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      matches:  Array< {
        __typename: "Match",
        id: string,
        status: MatchStatus | null,
      } >,
      orderedMatches:  Array< {
        __typename: "Match",
        id: string,
        status: MatchStatus | null,
      } >,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type GetEventQueryVariables = {
  id: string,
};

export type GetEventQuery = {
  getEvent:  {
    __typename: "Event",
    id: string,
    date: number,
    numPlayers: number,
    players:  Array< {
      __typename: "Player",
      id: string,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
      user:  {
        __typename: "User",
        id: string,
        name: string,
        _version: number,
        _deleted: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner: string | null,
      } | null,
    } >,
    teams:  Array< {
      __typename: "Team",
      id: string,
      players:  Array< {
        __typename: "Player",
        id: string,
      } >,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
    } >,
    matches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    orderedMatches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type ListEventsQueryVariables = {
  filter?: ModelEventFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEventsQuery = {
  listEvents:  {
    __typename: "ModelEventConnection",
    items:  Array< {
      __typename: "Event",
      id: string,
      date: number,
      numPlayers: number,
      players:  Array< {
        __typename: "Player",
        id: string,
      } >,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      matches:  Array< {
        __typename: "Match",
        id: string,
        status: MatchStatus | null,
      } >,
      orderedMatches:  Array< {
        __typename: "Match",
        id: string,
        status: MatchStatus | null,
      } >,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type SyncUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncUsersQuery = {
  syncUsers:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      name: string,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser:  {
    __typename: "User",
    id: string,
    name: string,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      name: string,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type OnCreateEventSubscriptionVariables = {
  owner: string,
};

export type OnCreateEventSubscription = {
  onCreateEvent:  {
    __typename: "Event",
    id: string,
    date: number,
    numPlayers: number,
    players:  Array< {
      __typename: "Player",
      id: string,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
      user:  {
        __typename: "User",
        id: string,
        name: string,
        _version: number,
        _deleted: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner: string | null,
      } | null,
    } >,
    teams:  Array< {
      __typename: "Team",
      id: string,
      players:  Array< {
        __typename: "Player",
        id: string,
      } >,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
    } >,
    matches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    orderedMatches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnUpdateEventSubscription = {
  onUpdateEvent:  {
    __typename: "Event",
    id: string,
    date: number,
    numPlayers: number,
    players:  Array< {
      __typename: "Player",
      id: string,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
      user:  {
        __typename: "User",
        id: string,
        name: string,
        _version: number,
        _deleted: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner: string | null,
      } | null,
    } >,
    teams:  Array< {
      __typename: "Team",
      id: string,
      players:  Array< {
        __typename: "Player",
        id: string,
      } >,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
    } >,
    matches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    orderedMatches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnDeleteEventSubscriptionVariables = {
  owner: string,
};

export type OnDeleteEventSubscription = {
  onDeleteEvent:  {
    __typename: "Event",
    id: string,
    date: number,
    numPlayers: number,
    players:  Array< {
      __typename: "Player",
      id: string,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
      user:  {
        __typename: "User",
        id: string,
        name: string,
        _version: number,
        _deleted: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner: string | null,
      } | null,
    } >,
    teams:  Array< {
      __typename: "Team",
      id: string,
      players:  Array< {
        __typename: "Player",
        id: string,
      } >,
      stats:  {
        __typename: "PlayerStats",
        numMatches: number,
        numWon: number,
        numDraws: number,
        numLost: number,
      },
    } >,
    matches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    orderedMatches:  Array< {
      __typename: "Match",
      id: string,
      teams:  Array< {
        __typename: "Team",
        id: string,
      } >,
      status: MatchStatus | null,
    } >,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  owner: string,
};

export type OnCreateUserSubscription = {
  onCreateUser:  {
    __typename: "User",
    id: string,
    name: string,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  owner: string,
};

export type OnUpdateUserSubscription = {
  onUpdateUser:  {
    __typename: "User",
    id: string,
    name: string,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  owner: string,
};

export type OnDeleteUserSubscription = {
  onDeleteUser:  {
    __typename: "User",
    id: string,
    name: string,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};
