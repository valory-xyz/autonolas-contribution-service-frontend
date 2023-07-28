import { lowerCase } from 'lodash';

export const menuItems = [
  {
    label: 'Home',
    key: 'home',
  },
  {
    label: 'Proposals',
    key: 'proposals',
  },
  {
    label: 'Plugins',
    key: 'plugins',
    children: [
      {
        label: 'Chatbot',
        key: 'chatbot',
      },
      {
        label: 'Social Poster',
        key: 'social-poster',
      },
    ],
  },
  {
    label: 'Memory',
    key: 'memory',
  },
  {
    label: 'Settings',
    key: 'settings',
    children: [
      {
        label: 'Members',
        key: 'members',
      },
      {
        label: 'Plugins',
        key: 'plugins',
      },
    ],
  },
];

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
