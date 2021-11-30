import dayjs from 'dayjs';
import { Event, EventType } from '../../models';

describe('Utils', () => {
  it('should runs utils as expected', async () => {
    const event = new Event({
      date: dayjs().add(1, 'hour').startOf('hour').toDate()
        .toISOString(),
      type: EventType.DOUBLES_ROUND_ROBIN,
    });
  });
});
