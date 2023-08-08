import { lowerCase } from 'lodash';

export const menuItems = [
  {
    label: 'Community Twitter',
    key: 'community-twitter',
    children: [

      {
        label: 'Propose a Tweet',
        key: 'social-poster',
      },
      {
        label: 'Tweet Proposals',
        key: 'proposals',
      },
    ],
  },
  {
    label: 'Chatbot',
    key: 'chatbot',
  },
  {
    label: 'Memory',
    key: 'memory',
  },
  {
    label: 'Members',
    key: 'members',
  },
  {
    label: 'Group Chat',
    key: 'home',
  },
  // {
  //   label: 'Settings',
  //   key: 'settings',
  //   children: [
  //     {
  //       label: 'Plugins',
  //       key: 'plugins',
  //     },
  //   ],
  // },
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
