/* eslint-disable import/no-unresolved */
import { base16 } from 'multiformats/bases/base16';
import { create } from 'ipfs-http-client';
import { GATEWAY_URL } from 'util/constants';

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

const extensionRegex = /\.[^.]+$/;
export const getMediaSrc = (hashWithExtension) => {
  const hash = hashWithExtension.replace(extensionRegex, '');

  return `${GATEWAY_URL}${hash}`;
};
