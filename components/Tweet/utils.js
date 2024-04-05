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

export const uploadManyToIpfs = async (media) => {
  const mediaPromises = [];

  media.forEach((file) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    const extension = file.type.split('/').pop(); // Get file extension
    mediaPromises.push(
      new Promise((resolve, reject) => {
        fileReader.onloadend = async () => {
          try {
            // Upload the file to IPFS
            const hash = await uploadToIpfs(fileReader.result);
            resolve(`${hash}.${extension}`);
          } catch (error) {
            reject(error);
          }
        };
      }),
    );
  });

  return Promise.all(mediaPromises);
};

const extensionRegex = /\.[^.]+$/;
export const getMediaSrc = (hashWithExtension) => {
  const hash = hashWithExtension.replace(extensionRegex, '');

  return `${GATEWAY_URL}${hash}`;
};
