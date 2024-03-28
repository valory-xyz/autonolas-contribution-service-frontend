import { ethers, BigNumber } from 'ethers';
import { fetchVeolasBalance, getDelegateContributeContract } from 'common-util/Contracts';

/**
 * balanceOf veOlas contract - it is the amount of veolas locked
 */
export const fetchVotingPower = async ({ account }) => {
  const contract = getDelegateContributeContract();
  const votingPower = await contract.methods.votingPower(account).call();
  return votingPower;
};

export const checkVeolasThreshold = async (account, thresholdInWei) => {
  const balance = await fetchVeolasBalance({ account });
  const bNBalance = ethers.toBigInt(balance);
  const processedThreshold = ethers.toBigInt(thresholdInWei);
  return bNBalance >= processedThreshold;
};

export const checkVotingPower = async (account, thresholdInWei) => {
  const votingPower = await fetchVotingPower({ account });
  const bNVotingPower = BigNumber.from(votingPower);
  const thresholdInBn = BigNumber.from(thresholdInWei);
  return bNVotingPower.gte(thresholdInBn);
};
