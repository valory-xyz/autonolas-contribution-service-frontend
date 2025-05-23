import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { cloneDeep, get } from 'lodash';
import { fromString } from 'uint8arrays';

import { UsersDbContent } from 'types/streams';
import { XProfile } from 'types/x';

const API_URL = 'https://ceramic-valory.hirenodes.io';
const CERAMIC_OBJECT = new CeramicClient(API_URL);

export const getLeaderboardList = async () => {
  const response = await TileDocument.load(
    CERAMIC_OBJECT,
    process.env.NEXT_PUBLIC_STREAM_ID as string,
  );
  const users: UsersDbContent = get(response, 'content.users', {});

  const usersList = Object.values(users)
    .filter((e) => !!e.wallet_address)
    .filter((e) => e.points !== 0)
    .map((user, index) => ({
      ...user,
      // adding a unique key to each user
      rowKeyUi: `${user.wallet_address}-${user.discord_id}-${index}`,
    }));

  return usersList;
};

export const updateUserStakingData = async (
  twitterId: string | null,
  multisig: string,
  serviceId: string,
) => {
  const provider = new Ed25519Provider(
    fromString(process.env.NEXT_PUBLIC_CERAMIC_SEED as string, 'base16'),
  );
  const did = new DID({ provider, resolver: getResolver() });
  // Authenticate the DID with the provider
  await did.authenticate();
  // The Ceramic client can create and update streams using the authenticated DID
  CERAMIC_OBJECT.did = did;

  const response = await TileDocument.load<{
    users: UsersDbContent;
  }>(CERAMIC_OBJECT, process.env.NEXT_PUBLIC_STREAM_ID as string);

  const newContent = cloneDeep<{
    users: UsersDbContent;
  }>(response.content);

  // Find a user by the provided twitterId
  for (let key in newContent.users) {
    if (newContent.users[key].twitter_id === twitterId) {
      // Update service_multisig and service_id
      newContent.users[key].service_multisig = multisig;
      newContent.users[key].service_id = serviceId;
      break;
    }
  }

  // Update the data
  await response.update(newContent);
};

export const clearUserOldStakingData = async (twitterId: string | null) => {
  const provider = new Ed25519Provider(
    fromString(process.env.NEXT_PUBLIC_CERAMIC_SEED as string, 'base16'),
  );
  const did = new DID({ provider, resolver: getResolver() });
  // Authenticate the DID with the provider
  await did.authenticate();
  // The Ceramic client can create and update streams using the authenticated DID
  CERAMIC_OBJECT.did = did;

  const response = await TileDocument.load<{
    users: UsersDbContent;
  }>(CERAMIC_OBJECT, process.env.NEXT_PUBLIC_STREAM_ID as string);

  const newContent = cloneDeep<{
    users: UsersDbContent;
  }>(response.content);

  // Find a user by the provided twitterId
  for (let key in newContent.users) {
    if (newContent.users[key].twitter_id === twitterId) {
      newContent.users[key].service_multisig_old = null;
      newContent.users[key].service_id_old = null;
      break;
    }
  }

  // Update the data
  await response.update(newContent);
};
