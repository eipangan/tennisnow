/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent(
    $filter: ModelSubscriptionEventFilterInput
    $owner: String
  ) {
    onCreateEvent(filter: $filter, owner: $owner) {
      id
      date
      place
      type
      summary
      details
      matches {
        nextToken
        __typename
      }
      players {
        nextToken
        __typename
      }
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent(
    $filter: ModelSubscriptionEventFilterInput
    $owner: String
  ) {
    onUpdateEvent(filter: $filter, owner: $owner) {
      id
      date
      place
      type
      summary
      details
      matches {
        nextToken
        __typename
      }
      players {
        nextToken
        __typename
      }
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent(
    $filter: ModelSubscriptionEventFilterInput
    $owner: String
  ) {
    onDeleteEvent(filter: $filter, owner: $owner) {
      id
      date
      place
      type
      summary
      details
      matches {
        nextToken
        __typename
      }
      players {
        nextToken
        __typename
      }
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMatch = /* GraphQL */ `
  subscription OnCreateMatch(
    $filter: ModelSubscriptionMatchFilterInput
    $owner: String
  ) {
    onCreateMatch(filter: $filter, owner: $owner) {
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
  subscription OnUpdateMatch(
    $filter: ModelSubscriptionMatchFilterInput
    $owner: String
  ) {
    onUpdateMatch(filter: $filter, owner: $owner) {
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
  subscription OnDeleteMatch(
    $filter: ModelSubscriptionMatchFilterInput
    $owner: String
  ) {
    onDeleteMatch(filter: $filter, owner: $owner) {
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
  subscription OnCreatePlayer(
    $filter: ModelSubscriptionPlayerFilterInput
    $owner: String
  ) {
    onCreatePlayer(filter: $filter, owner: $owner) {
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
  subscription OnUpdatePlayer(
    $filter: ModelSubscriptionPlayerFilterInput
    $owner: String
  ) {
    onUpdatePlayer(filter: $filter, owner: $owner) {
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
  subscription OnDeletePlayer(
    $filter: ModelSubscriptionPlayerFilterInput
    $owner: String
  ) {
    onDeletePlayer(filter: $filter, owner: $owner) {
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
