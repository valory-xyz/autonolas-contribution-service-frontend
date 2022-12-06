import { getMintContract } from 'common-util/Contracts';
import { notifySuccess } from 'common-util/functions';
import { findIndex, toLower, get } from 'lodash';
import { GATEWAY_URL } from 'util/constants';

// TODO: replace with findLastIndex
const findLastIndex = findIndex;

const pattern = /ipfs:\/\/+/g;
export const getAutonolasTokenUri = (tokenUri) => (tokenUri || '').replace(pattern, GATEWAY_URL);

export const getLatestMintedNft = (account) => new Promise((resolve, reject) => {
  const contract = getMintContract();

  contract.methods
    .totalSupply()
    .call()
    .then((total) => {
      const nftImages = [];
      for (let i = 1; i <= total; i += 1) {
        const result = contract.methods.ownerOf(`${i}`).call();
        nftImages.push(result);
      }

      Promise.all(nftImages).then(async (ownerList) => {
        /**
           * find the element in reverse order to fetch the latest
           */
        const lastIndex = findLastIndex(
          ownerList,
          (e) => toLower(e) === toLower(account),
        );
        if (lastIndex !== -1) {
          const infoUrl = await contract.methods
            .tokenURI(`${Number(lastIndex) + 1}`)
            .call();

          resolve({ isFound: true, response: infoUrl });
        } else {
          resolve({ isFound: false, response: null });
        }
      });
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const mintNft = (account) => new Promise((resolve, reject) => {
  const contract = getMintContract();

  contract.methods
    .mint()
    .send({ from: account })
    // .once('transactionHash', (hash) => resolve(hash))
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
  const infoUrl = await contract.methods
    .tokenURI(`${id}`)
    .call();

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
