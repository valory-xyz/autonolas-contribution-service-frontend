import { CID } from 'multiformats/cid';
import { create } from 'ipfs-http-client';
import { base16 } from 'multiformats/bases/base16';

export const getFirstTenCharsOfTweet = (tweetOrThread) => {
  if (typeof tweetOrThread === 'string') {
    return tweetOrThread.substring(0, 10);
  }
  return (tweetOrThread[0] || '').substring(0, 10);
};

const ipfs = create({
  host: process.env.NEXT_PUBLIC_REGISTRY_URL,
  port: 443,
  protocol: 'https',
});

/**
 *
 * @param {string | ArrayBuffer} file
 * @returns hash to the file
 */
export const uploadToIpfs = async (file) => {
  const response = await ipfs.add(file);
  const hash = response.cid.toV1().toString(base16.encoder);
  return hash;
};

/**
 *
 * @param {string} hash
 * Gets V0 CID and mark it for garbage collection
 */
export const unpinFromIpfs = async (hash) => {
  try {
    const cid = CID.decode(base16.decode(hash)).toV0().toString();
    await ipfs.pin.rm(cid);
  } catch (error) {
    console.error(error);
  }
};
