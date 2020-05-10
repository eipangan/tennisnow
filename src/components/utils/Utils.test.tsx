import { generateUUID } from './Utils';

test('generateUUID - normal case', async () => {
  expect(generateUUID()).toContain('-');
});
