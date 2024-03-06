import { ethers } from 'ethers';
import { getVeolasContract } from 'common-util/Contracts';

/**
 * balanceOf veOlas contract - it is the amount of veolas locked
 */
export const fetchVeolasBalance = async ({ account }) => {
  const contract = getVeolasContract(true);
  const balance = await contract.methods.getVotes(account).call();
  return balance;
};

export const checkVeolasThreshold = async (account, thresholdInWei) => {
  const balance = await fetchVeolasBalance({ account });
  const bNBalance = ethers.toBigInt(balance);
  const processedThreshold = ethers.toBigInt(thresholdInWei);
  return bNBalance >= processedThreshold;
};
