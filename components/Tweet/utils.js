/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import { create } from 'ipfs-http-client';
import { base32 } from 'multiformats/bases/base32';
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
  const hash = response.cid.toV1().toString(base32.encoder);
  return hash;
};

export const uploadManyToIpfs = async (files) => {
  const mediaPromises = [];

  files.forEach((file) => {
    mediaPromises.push(
      new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        const fileExtension = file.type.split('/').pop();
        fileReader.onloadend = async () => {
          try {
            // Upload the file to IPFS
            const hash = await uploadToIpfs(fileReader.result);
            resolve(`${hash}.${fileExtension}`);
          } catch (error) {
            reject(error);
          }
        };
        fileReader.readAsArrayBuffer(file);
      }),
    );
  });

  return Promise.allSettled(mediaPromises);
};

const extensionRegex = /\.[^.]+$/;
export const getMediaSrc = (hashWithExtension) => {
  const hash = hashWithExtension.replace(extensionRegex, '');

  return `${GATEWAY_URL}${hash}`;
};
