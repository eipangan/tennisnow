import { DataStore } from 'aws-amplify';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { useEffect, useState } from 'react';
import { Event, EventType } from '../models';

// initialize dayjs
dayjs.extend(calendar);

/**
 * useEvent custom hook to handle events
 *
 * @param eventID
 */
const useEvent = (id?: string) => {
  const [event, setEvent] = useState<Event>((): Event => {
    const newEvent = new Event({
      date: dayjs().add(1, 'hour').startOf('hour').toDate()
        .toISOString(),
      type: EventType.SINGLES_ROUND_ROBIN,
    });

    return newEvent;
  });

  // re-fetch event when id changes
  useEffect(() => {
    let mounted = true;
    const fetchEvent = async (myID: string) => {
      const fetchedEvent = await DataStore.query(Event, myID);
      if (fetchedEvent && mounted) {
        setEvent(fetchedEvent);
      }
    };

    if (id) { fetchEvent(id); }
    return () => {
      mounted = false;
    };
  }, [id]);

  return { event };
};

export default useEvent;
