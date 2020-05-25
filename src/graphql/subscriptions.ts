/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent($owner: String!) {
    onCreateEvent(owner: $owner) {
      id
      date
      numPlayers
      players {
        id
        stats {
          numMatches
          numWon
          numDraws
          numLost
        }
        user {
          id
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          owner
        }
      }
      teams {
        id
        players {
          id
        }
        stats {
          numMatches
          numWon
          numDraws
          numLost
        }
      }
      matches {
        id
        teams {
          id
        }
        status
      }
      orderedMatches {
        id
        teams {
          id
        }
        status
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent {
    onUpdateEvent {
      id
      date
      numPlayers
      players {
        id
        stats {
          numMatches
          numWon
          numDraws
          numLost
        }
        user {
          id
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          owner
        }
      }
      teams {
        id
        players {
          id
        }
        stats {
          numMatches
          numWon
          numDraws
          numLost
        }
      }
      matches {
        id
        teams {
          id
        }
        status
      }
      orderedMatches {
        id
        teams {
          id
        }
        status
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent($owner: String!) {
    onDeleteEvent(owner: $owner) {
      id
      date
      numPlayers
      players {
        id
        stats {
          numMatches
          numWon
          numDraws
          numLost
        }
        user {
          id
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          owner
        }
      }
      teams {
        id
        players {
          id
        }
        stats {
          numMatches
          numWon
          numDraws
          numLost
        }
      }
      matches {
        id
        teams {
          id
        }
        status
      }
      orderedMatches {
        id
        teams {
          id
        }
        status
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($owner: String!) {
    onCreateUser(owner: $owner) {
      id
      name
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($owner: String!) {
    onUpdateUser(owner: $owner) {
      id
      name
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($owner: String!) {
    onDeleteUser(owner: $owner) {
      id
      name
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
