import { lowerCase } from 'lodash';

/**
 * returns error message if user can't add memory message
 * else returns null. If null, enable the button to add memory
 */
export const canAddMemoryMessaage = (list, account) => {
  if (!account) return 'To add to memory, connect wallet';

  const isPresent = list.some(
    (item) => lowerCase(item.address) === lowerCase(account),
  );
  if (!isPresent) return 'To add to memory, join this centaur';

  return null;
};
