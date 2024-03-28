import { BigNumber } from 'ethers';
import { getDelegateContributeContract } from 'common-util/Contracts';

/**
 * balanceOf veOlas contract - it is the amount of veolas locked
 */
export const fetchVotingPower = async ({ account }) => {
  const contract = getDelegateContributeContract();
  const votingPower = await contract.methods.votingPower(account).call();
  return votingPower;
};

export const checkVotingPower = async (account, thresholdInWei) => {
  const votingPower = await fetchVotingPower({ account });
  const bNVotingPower = BigNumber.from(votingPower);
  const thresholdInBn = BigNumber.from(thresholdInWei);
  return bNVotingPower.gte(thresholdInBn);
};
