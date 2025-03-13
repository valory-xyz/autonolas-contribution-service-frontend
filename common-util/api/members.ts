import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { fromString } from 'uint8arrays';

import { XProfile } from 'types/x';

export const CERAMIC_OBJECT = new CeramicClient(process.env.NEXT_PUBLIC_CERAMIC_GATEWAY_URL);

export const getMemoryDetails = async () => {
  const response = await TileDocument.load(
    CERAMIC_OBJECT,
    process.env.NEXT_PUBLIC_COORDINATE_STREAM_ID as string,
  );
  return { response: response.content, ceramic: CERAMIC_OBJECT };
};

export const updateMemoryDetails = async (memoryDetails: Record<string, XProfile>) => {
  const provider = new Ed25519Provider(
    fromString(process.env.NEXT_PUBLIC_CERAMIC_SEED as string, 'base16'),
  );
  const did = new DID({ provider, resolver: getResolver() });
  // Authenticate the DID with the provider
  await did.authenticate();
  // The Ceramic client can create and update streams using the authenticated DID
  CERAMIC_OBJECT.did = did;

  const response = await TileDocument.load(
    CERAMIC_OBJECT,
    process.env.NEXT_PUBLIC_COORDINATE_STREAM_ID as string,
  );
  await response.update(memoryDetails);

  // Return the commit id of the updated Ceramic stream
  return response.state.log[response.state.log.length - 1].cid.toString();
};
