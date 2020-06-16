import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Event, Match, MatchStatus, Player } from '../../models';

// initialize dayjs
dayjs.extend(calendar);

/**
 * delete event
 *
 * @param myEvent
 */
export const deleteEvent = async (myEvent: Event) => {
  await DataStore.delete(myEvent);
};


/**
 * get new event
 */
export const getNewEvent = (): Event => {
  const event = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
  });

  return event;
};

/**
 * get next match or undefined if cannot get next match
 *
 * @param event
 */
export const getNextMatch = (
  eventID: string,
  players: Player[] = [],
  matches: Match[] = [],
): Match | undefined => {
  if (players.length < 2) return undefined;

  const getPotentialPlayers = () => {
    const numPlayed = players.map(() => 0);
    matches.forEach((myMatch) => {
      if (myMatch.playerIndices) {
        myMatch.playerIndices.forEach((playerIndex) => {
          numPlayed[playerIndex] += 1;
        });
      }
    });

    // initialize potential players
    const potentialPlayers: number[] = [];
    for (let i = 0; i < players.length; i += 1) {
      players.forEach((player) => {
        if (numPlayed[player.index] === i) {
          potentialPlayers.push(player.index);
        }
      });
    }

    return potentialPlayers;
  };

  const getPotentialMatches = () => {
    const allMatches = players.flatMap((v, i) => players.slice(i + 1).map((w) => `${v.index}-${w.index}`));
    const allMatchesDone = matches.map((m) => {
      if (!m.playerIndices) return undefined;
      return `${m.playerIndices[0]}-${m.playerIndices[1]}`;
    });
    const potentialMatches = allMatches.filter((m) => !allMatchesDone.includes(m));
    return potentialMatches;
  };

  const potentialPlayers = getPotentialPlayers();
  const potentialMatches = getPotentialMatches();


  // TEST
  console.log(potentialPlayers, potentialMatches);


  // build nextMatch
  const maxPlayerIndicex = 2;
  const nextMatch = new Match({
    eventID,
    playerIndices: potentialPlayers.slice(0, maxPlayerIndicex),
    status: MatchStatus.NEW,
  });

  return nextMatch;
};

/**
 * get players
 *
 * @param event
 * @param numPlayers
 * @param playerNames
 */
export const getPlayers = (
  eventID: string,
  numPlayers: number = 6,
  playerNames: string[] = [],
): Player[] | undefined => {
  const players: Player[] = [];
  for (let i = 0; i < numPlayers; i += 1) {
    players.push(new Player({
      eventID,
      index: i,
      name: playerNames[i] || '',
    }));
  }

  return players;
};

/**
 * save event
 *
 * @param myEvent
 */
export const saveEvent = async (myEvent: Event) => {
  await DataStore.save(myEvent);
};
