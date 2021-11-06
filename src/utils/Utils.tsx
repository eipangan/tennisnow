/**
 * get local date format
 */
export const getLocaleDateFormat = (): string => {
  const date = new Date('September 8, 2222');
  return date.toLocaleDateString(navigator.language, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
    .replace('09', 'M')
    .replace('9', 'M')
    .replace('08', 'DD')
    .replace('8', 'D')
    .replace('2222', 'YYYY')
    .replace('22', 'YY');
};

/**
 * shuffle contents of a string array
 *
 * @param a array of strings
 */
export const shuffle = (a: string[]): string[] => {
  let j;
  let x;
  let i;
  for (i = a.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};
