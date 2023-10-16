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

export const checkVeolasThreshold = async (account, thresholdInWei) => {
  const balance = await fetchVeolasBalance({ account });
  const bNBalance = BigNumber.from(balance);
  const processedThreshold = BigNumber.from(thresholdInWei);
  return bNBalance.gte(processedThreshold);
};
