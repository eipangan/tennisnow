import dayjs from 'dayjs';
import { Event, EventType } from '../../models';

describe('MatchUtils', () => {
  const event = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    type: EventType.DOUBLES_ROUND_ROBIN,
  });

  it('should run deleteMatch() as expected', async () => {
  });
});
