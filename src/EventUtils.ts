import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Event, EventType, Match, MatchStatus, Player } from './models';
import { deletePlayer, savePlayer } from './PlayerUtils';

// initialize dayjs
dayjs.extend(calendar);

/**
 * get players from DataStore, given an eventID
 *
 * @param eventID
 */
export const getPlayers = async (eventID: string): Promise<Player[]> => {
  let players: Player[] = [];
  const fetchedPlayers = await DataStore.query(Player, (p) => p.eventID('eq', eventID));
  if (fetchedPlayers && Array.isArray(fetchedPlayers)) {
    players = fetchedPlayers.sort((a, b) => a.index - b.index);
  }

  return players;
};

/**
 * get new event
 */
export const getNewEvent = (): Event => {
  const newEvent = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    type: EventType.GENERIC_EVENT,
  });

  return newEvent;
};

/**
 * get new players, return array of players
 *
 * @param eventID
 * @param numPlayers
 * @param playerNames
 */
export const getNewPlayers = (
  eventID: string,
  numPlayers: number = 6,
  playerNames: string[] = [],
): Player[] => {
  const newPlayers: Player[] = [];
  if (eventID && eventID.length > 0) {
    for (let i = 0; i < numPlayers; i += 1) {
      newPlayers.push(new Player({
        eventID,
        index: i,
        name: playerNames[i] || '',
      }));
    }
  }

  return newPlayers;
};

/**
 * save players for an event
 *
 * @param eventID id of the event
 * @param players players
 */
export const savePlayers = async (
  eventID: string,
  players: Player[],
): Promise<void> => {
  const currentPlayers = await DataStore.query(Player, (p) => p.eventID('eq', eventID));

  // remove unneeded players
  if (currentPlayers && Array.isArray(currentPlayers)) {
    const toRemovePlayers = currentPlayers.filter((p) => JSON.stringify(players).indexOf(JSON.stringify(p)) === -1);
    toRemovePlayers.forEach((player) => deletePlayer(player));
  }

  // save new players
  players.forEach((player) => savePlayer(player));
};

/**
 * useEvent custom hook to handle events
 *
 * @param eventID
 */
export const useEvent = (eventID: string) => {
  const history = useHistory();
  const [event, setEvent] = useState<Event>();

  const getNextMatch = async (): Promise<Match | undefined> => {
    const myEvent = event;
    if (!myEvent) return undefined;

    const myMatches = await DataStore.query(Match, (m) => m.eventID('eq', myEvent.id));
    const myPlayers = await getPlayers(myEvent.id);

    // get all matches in array of [p1, p2] format
    const getAllMatches = () => myPlayers.flatMap((v, i) => myPlayers
      .slice(i + 1)
      .map((w) => ([v.index, w.index])));

    // get all matches that already done in array of [p1, p2] format
    const getAllMatchesDone = () => myMatches.map((m) => {
      if (!m.playerIndices) return undefined;
      return ([m.playerIndices[0], m.playerIndices[1]]);
    });

    // get potential players, size is always equal to number of players
    const getPotentialPlayers = () => {
      // calculate number of matches played
      const numPlayed = myPlayers.map(() => 0);
      myMatches.forEach((myMatch) => {
        if (myMatch.playerIndices) {
          myMatch.playerIndices.forEach((playerIndex) => {
            numPlayed[playerIndex] += 1;
          });
        }
      });

      // get potential players
      const potentialPlayers: number[] = [];
      for (let i = 0; i <= myMatches.length; i += 1) {
        myPlayers.forEach((player) => {
          if (numPlayed[player.index] === i) {
            potentialPlayers.push(player.index);
          }
        });
      }

      // return potential players
      return potentialPlayers;
    };

    /**
      * get potential matches
      */
    const getPotentialMatches = () => {
      const allMatches = getAllMatches();
      const allMatchesDone = getAllMatchesDone();

      const potentialMatches = allMatches.filter((m) => JSON
        .stringify(allMatchesDone)
        .indexOf(JSON.stringify(m)) === -1);
      return potentialMatches;
    };

    const potentialPlayers = getPotentialPlayers();
    const potentialMatches = getPotentialMatches();

    if (potentialPlayers.length === 0) return undefined;
    if (potentialMatches.length === 0 && myMatches.length > 0) {
      // TODO: need to fix this logic
      return (new Match({
        eventID: myEvent.id,
        createdTime: dayjs().toDate().toISOString(),
        playerIndices: [0, 1],
        status: MatchStatus.NEW,
      }));
    }

    // get next match
    let nextMatch: Match | undefined;
    const BreakException = {};
    try {
      potentialPlayers.forEach((p1) => {
        potentialPlayers.forEach((p2) => {
          if (JSON.stringify(potentialMatches).indexOf(JSON.stringify([p1, p2])) !== -1) {
            nextMatch = new Match({
              eventID,
              createdTime: dayjs().toDate().toISOString(),
              playerIndices: [p1, p2],
              status: MatchStatus.NEW,
            });
            throw BreakException;
          }
        });
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }

    return nextMatch;
  };

  useEffect(() => {
    const fetchEvent = async (id: string) => {
      const fetchedEvent = await DataStore.query(Event, id);
      if (!fetchedEvent) history.push('/');
      setEvent(fetchedEvent);
    };

    fetchEvent(eventID);
    const subscription = DataStore.observe(Event, eventID)
      .subscribe(() => fetchEvent(eventID));
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventID]);

  return { event, getNextMatch };
};
