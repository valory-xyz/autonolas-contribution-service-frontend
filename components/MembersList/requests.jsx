import { BigNumber } from 'ethers';
import { getVeolasContract, getDelegateContributeContract } from 'common-util/Contracts';

/**
 * balanceOf veOlas contract - it is the amount of veolas locked
 */
export const fetchVeolasBalance = async ({ account }) => {
  const contract = getVeolasContract(true);
  const balance = await contract.methods.getVotes(account).call();
  return balance;
};

export const fetchVotingPower = async ({ account }) => {
  const contract = getDelegateContributeContract();
  const votingPower = await contract.methods.votingPower(account).call();
  return votingPower;
};

export const checkVeolasThreshold = async (account, thresholdInWei) => {
  const balance = await fetchVeolasBalance({ account });
  const bNBalance = BigNumber.from(balance);
  const processedThreshold = BigNumber.from(thresholdInWei);
  return bNBalance.gte(processedThreshold);
};

export const checkVotingPower = async (account, thresholdInWei) => {
  const votingPower = await fetchVotingPower({ account });
  const bNVotingPower = BigNumber.from(votingPower);
  const thresholdInBn = BigNumber.from(thresholdInWei);
  return bNVotingPower.gte(thresholdInBn);
};
