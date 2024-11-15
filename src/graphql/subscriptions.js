/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent($owner: String!) {
    onCreateEvent(owner: $owner) {
      id
      date
      place
      type
      summary
      details
      owner
      createdAt
      updatedAt
      matches {
        nextToken
        __typename
      }
      players {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent($owner: String!) {
    onUpdateEvent(owner: $owner) {
      id
      date
      place
      type
      summary
      details
      owner
      createdAt
      updatedAt
      matches {
        nextToken
        __typename
      }
      players {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent($owner: String!) {
    onDeleteEvent(owner: $owner) {
      id
      date
      place
      type
      summary
      details
      owner
      createdAt
      updatedAt
      matches {
        nextToken
        __typename
      }
      players {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const onCreateMatch = /* GraphQL */ `
  subscription OnCreateMatch($owner: String!) {
    onCreateMatch(owner: $owner) {
      id
      eventID
      orderID
      playerIndices
      status
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMatch = /* GraphQL */ `
  subscription OnUpdateMatch($owner: String!) {
    onUpdateMatch(owner: $owner) {
      id
      eventID
      orderID
      playerIndices
      status
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMatch = /* GraphQL */ `
  subscription OnDeleteMatch($owner: String!) {
    onDeleteMatch(owner: $owner) {
      id
      eventID
      orderID
      playerIndices
      status
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreatePlayer = /* GraphQL */ `
  subscription OnCreatePlayer($owner: String!) {
    onCreatePlayer(owner: $owner) {
      id
      eventID
      index
      name
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdatePlayer = /* GraphQL */ `
  subscription OnUpdatePlayer($owner: String!) {
    onUpdatePlayer(owner: $owner) {
      id
      eventID
      index
      name
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeletePlayer = /* GraphQL */ `
  subscription OnDeletePlayer($owner: String!) {
    onDeletePlayer(owner: $owner) {
      id
      eventID
      index
      name
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
