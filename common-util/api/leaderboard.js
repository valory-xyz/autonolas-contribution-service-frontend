import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { get } from 'lodash';

const API_URL = 'https://ceramic-clay.3boxlabs.com';

export const getLeaderboardList = async () => {
  const ceramic = new CeramicClient(API_URL);

  const streamId = process.env.NEXT_PUBLIC_ENV === 'production'
    ? process.env.NEXT_PUBLIC_STREAM_ID_PRODUCTION
    : process.env.NEXT_PUBLIC_STREAM_ID_STAGING;

  const response = await TileDocument.load(ceramic, streamId);
  const users = get(response, 'content.users') || [];

  const usersList = users.map((user, index) => ({
    ...user,
    // adding a unique key to each user
    rowKeyUi: `${user.twitter_handle}-${user.discord_id}-${index}`,
  }));

  return usersList;
};
