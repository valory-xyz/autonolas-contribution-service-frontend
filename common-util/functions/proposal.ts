import { ethers } from 'ethers';
import { isNil } from 'lodash';

import { ethersToWei, formatToEth } from 'common-util/functions';
import { ModuleDetails } from 'store/types';
import { VEOLAS_QUORUM } from 'util/constants';

// 2 million veolas in wei
const quorumInWei = ethersToWei(`${VEOLAS_QUORUM}`);

/**
 * check if the current proposal has enough veOLAS to be executed
 */
export const getCurrentProposalInfo = (
  proposal: ModuleDetails['scheduled_tweet']['tweets'][number],
) => {
  // example of voters: [ { '0x123': '1000000000000000000000000' } ]
  const totalVeolasInWei = proposal?.voters?.reduce((acc, voter) => {
    // previously the voters were stored as an [account]: balance.
    // now, it is stored as an object (eg. Check "Voter" in prop-types.js).
    const currentVeOlasInWei = !isNil(voter?.votingPower)
      ? ethersToWei(`${voter?.votingPower || '0'}`)
      : Object.values(voter)[0];

    return acc + ethers.toBigInt(currentVeOlasInWei);
  }, 0n);

  // check if voters have 2 million veolas in total
  const isQuorumAchieved = totalVeolasInWei >= quorumInWei;

  const remainingVeolasForApprovalInEth = formatToEth(
    ethers.toBigInt(quorumInWei) - ethers.toBigInt(totalVeolasInWei),
  );

  // percentage of veolas invested in the proposal
  // limit it to 2 decimal places
  const totalVeolasInvestedInPercentage = ((totalVeolasInWei * 100n) / quorumInWei).toString();

  const isProposalVerified = proposal?.proposer?.verified;

  const votersAddress = proposal?.voters?.map((voter) => {
    const address = voter.address || Object.keys(voter)[0];
    return address;
  });

  return {
    isQuorumAchieved,
    totalVeolasInEth: formatToEth(totalVeolasInWei),
    remainingVeolasForApprovalInEth,
    totalVeolasInvestedInPercentage,
    isProposalVerified,
    votersAddress,
  };
};
