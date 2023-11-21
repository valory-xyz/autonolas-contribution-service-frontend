import get from 'lodash/get';
import { notifySuccess } from '@autonolas/frontend-library';

import { getMintContract } from 'common-util/Contracts';
import { GATEWAY_URL } from 'util/constants';

const pattern = /ipfs:\/\/+/g;
export const getAutonolasTokenUri = (tokenUri) => (tokenUri || '').replace(pattern, GATEWAY_URL);

export const mintNft = (account) => new Promise((resolve, reject) => {
  const contract = getMintContract();

  contract.methods
    .mint()
    .send({ from: account })
    .then((response) => {
      notifySuccess('Successfully Minted');
      const id = get(response, 'events.Transfer.returnValues.id');
      resolve(id);
    })
    .catch((e) => {
      window.console.log('Error occured on minting NFT');
      reject(e);
    });
});

export async function pollNftDetails(id) {
  const contract = getMintContract();
  const infoUrl = await contract.methods.tokenURI(`${id}`).call();

  return new Promise((resolve, reject) => {
    /* eslint-disable-next-line consistent-return */
    const interval = setInterval(async () => {
      window.console.log('Fetching NFT details...');

      try {
        const response = await fetch(infoUrl);

        // poll until the URL is resolved with 200 response
        if (response.status === 200) {
          const json = await response.json();
          const image = get(json, 'image');

          if (image) {
            window.console.log('NFT details: ', json);
            clearInterval(interval);
            resolve(json);
          }
        }
      } catch (error) {
        reject(error);
      }
    }, 4000);
  });
}
