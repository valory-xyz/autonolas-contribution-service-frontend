import axios from 'axios';
import { getMintContract } from 'common-util/Contracts';
import { notifyError } from 'common-util/functions';
import { findIndex, toLower } from 'lodash';

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
      console.log({ nftImages });

      Promise.all(nftImages).then(async (ownerList) => {
        console.log({ ownerList });

        /**
           * find the element in reverse order to fetch the latest
           */
        const lastIndex = findIndex(
          ownerList,
          (e) => toLower(e) === toLower(account),
        );

        console.log({ lastIndex });

        if (lastIndex !== -1) {
          const tokenId = `${Number(lastIndex) + 1}`;
          const infoUrl = await contract.methods.tokenURI(tokenId).call();

          console.log({ tokenId, infoUrl });

          if (infoUrl) {
            const value = await axios.get(infoUrl);
            resolve({ details: value.data, tokenId });
          } else {
            resolve({ details: null, tokenId: null });
          }
        } else {
          resolve({ details: null, tokenId: null });
        }
      });
    })
    .catch((e) => {
      notifyError('Error while fetching NFT details');
      console.error(e);
      reject(e);
    });
});
