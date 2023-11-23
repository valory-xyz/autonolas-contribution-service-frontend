/* eslint-disable no-await-in-loop */
import { notifyError } from '@autonolas/frontend-library';
import axios from 'axios';
import { getMintContract } from 'common-util/Contracts';
import { findIndex, toLower, memoize } from 'lodash';

const getTotalSupply = memoize(async () => {
  try {
    const contract = getMintContract();
    const total = await contract.methods.totalSupply().call();
    return total;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const getLatestMintedNft = memoize(async (account) => {
  try {
    const contract = getMintContract();
    const total = await getTotalSupply();
    const nftImages = [];
    for (let i = 1; i <= total; i += 1) {
      const result = await contract.methods.ownerOf(`${i}`).call();
      nftImages.push(result);
    }

    const ownerList = await Promise.all(nftImages);

    /**
     * find the element in reverse order to fetch the latest
     */
    const latestNftIndex = findIndex(
      ownerList,
      (e) => toLower(e) === toLower(account),
    );

    if (latestNftIndex !== -1) {
      const tokenId = `${Number(latestNftIndex) + 1}`;
      const infoUrl = await contract.methods.tokenURI(tokenId).call();

      if (infoUrl) {
        const value = await axios.get(infoUrl);
        return { details: value.data, tokenId };
      }
      return { details: null, tokenId: null };
    }

    return { details: null, tokenId: null };
  } catch (e) {
    notifyError('Error fetching NFT details');
    console.error(e);
    throw e;
  }
});
