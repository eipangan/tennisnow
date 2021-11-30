import dayjs from 'dayjs';
import { Event, EventType } from '../../models';

describe('PlayerUtils', () => {
  const event = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    type: EventType.DOUBLES_ROUND_ROBIN,
  });

  it('should runs getPlayerName() as expected', async () => {
  });
});
