import { BigNumber } from 'ethers';
import { getVeolasContract } from 'common-util/Contracts';

/**
 * balanceOf veOlas contract - it is the amount of veolas locked
 */
export const fetchVeolasBalance = async ({ account }) => {
  const contract = getVeolasContract(true);
  const balance = await contract.methods.balanceOf(account).call();
  return balance;
};

export const checkIfHas100kVeOlas = async ({ account }) => {
  const balance = await fetchVeolasBalance({ account });
  const bNBalance = BigNumber.from(balance);
  const threshold = BigNumber.from('100000000000000000000000');
  return bNBalance.gte(threshold);
};
