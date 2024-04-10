import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { get } from 'lodash';

const API_URL = 'https://ceramic-valory.hirenodes.io';

export const getLeaderboardList = async () => {
  const ceramic = new CeramicClient(API_URL);

  const response = await TileDocument.load(ceramic, process.env.NEXT_PUBLIC_STREAM_ID);
  const users = get(response, 'content.users') || [];

  const usersList = users
    .filter((user) => user.points !== 0 && (!!user.twitter_id || !!user.wallet_address))
    .map((user, index) => ({
      ...user,
      // adding a unique key to each user
      rowKeyUi: [user.wallet_address, user.twitter_id, user.discord_id, index].filter(Boolean).join('-'),
    }));

  return usersList;
};
