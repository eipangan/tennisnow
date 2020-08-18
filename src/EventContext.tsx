import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getMatches, getPlayers } from './EventUtils';
import { Event, Match, MatchStatus } from './models';

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

    const myMatches = await getMatches(myEvent.id);
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

/**
 * EventContextType
 */
export interface EventContextType {
  event: Event,
  getNextMatch?: () => Promise<Match | undefined>,
}

export const EventContext = React.createContext({} as EventContextType);
