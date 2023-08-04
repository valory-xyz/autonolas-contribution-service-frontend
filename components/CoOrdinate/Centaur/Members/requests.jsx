import { formatToEth } from 'common-util/functions';
import { getVeolasContract } from 'common-util/Contracts';

/**
 * balanceOf veOlas contract - it is the amount of veolas locked
 */
export const fetchVeolasBalance = ({ account }) => new Promise((resolve, reject) => {
  const contract = getVeolasContract(true);

  contract.methods
    .balanceOf(account)
    .call()
    .then((response) => {
      resolve(formatToEth(response));
    })
    .catch((error) => {
      reject(error);
    });
});
