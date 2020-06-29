import { generateUUID } from './Utils';

test('generateUUID - normal case', () => {
  expect(generateUUID()).toContain('-');
});
