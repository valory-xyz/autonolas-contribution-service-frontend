import { getMintContract } from 'common-util/Contracts';
import { findLastIndex, toLower } from 'lodash';
import { GATEWAY_URL } from 'util/constants';

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

  // try {
  //   Promise.allSettled(nftImages).then(async (existsResult) => {
  //     // filter services which don't exists (deleted or destroyed)
  //     const validTokenIds = [];
  //     existsResult.forEach((item, index) => {
  //       const serviceId = `${first + index}`;
  //       if (item.status === 'fulfilled' && !!item.value) {
  //         validTokenIds.push(serviceId);
  //       }
  //     });

  //     // list of promises of valid service
  //     const results = await Promise.all(
  //       validTokenIds.map(async (id) => {
  //         const info = await getServiceDetails(id);
  //         const owner = await getServiceOwner(id);
  //         return { ...info, id, owner };
  //       }),
  //     );

  //     resolve(results);
  //   });
  // } catch (e) {
  //   console.error(e);
  //   reject(e);
  // }
});
