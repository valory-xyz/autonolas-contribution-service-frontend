import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { isNil, set, cloneDeep } from 'lodash';
import {
  areAddressesEqual,
  // notifySuccess
} from '@autonolas/frontend-library';

import { setMemoryDetails } from 'store/setup';
import { addActionToCentaur } from 'util/addActionToCentaur';
import { DEFAULT_COORDINATE_ID, VEOLAS_QUORUM } from 'util/constants';
import { getMemoryDetails, updateMemoryDetails } from 'common-util/api';
import { ethersToWei, formatToEth } from 'common-util/functions';
// import dummyMemory from './resetMemoryDetails.json';

/**
 * only for internal use (for staging)
 */
// export const resetMemoryDetails = async () => {
//   await updateMemoryDetails(dummyMemory);
//   notifySuccess('Memory details reset successfully');
// };

/**
 * internal hook to get the centaur details
 * and the information should be exposed via other hooks
 */
const useCentaurs = () => {
  const router = useRouter();
  const centaurId = router?.query?.id || DEFAULT_COORDINATE_ID;
  const memoryDetailsList = useSelector(
    (state) => state?.setup?.memoryDetails || [],
  );
  const currentMemoryDetails = memoryDetailsList.find((c) => c.id === centaurId) || {};

  return {
    currentMemoryDetails,
    memoryDetailsList,
  };
};

export const useCentaursFunctionalities = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const isMemoryDetailsLoading = useSelector(
    (state) => state?.setup?.isMemoryDetailsLoading,
  );

  const { currentMemoryDetails, memoryDetailsList } = useCentaurs();

  /**
   * Fetches the updated memory details from Ceramic
   */
  const fetchUpdatedMemory = async () => {
    const { response: responseAfterUpdate } = await getMemoryDetails();
    dispatch(setMemoryDetails(responseAfterUpdate)); // update the redux state with new memory
    return responseAfterUpdate;
  };

  /**
   * function to update the memory with the new centaur
   */
  const updateMemoryWithNewCentaur = async (updatedCentaur) => {
    const updatedMemoryDetails = memoryDetailsList.map((centaur) => {
      if (centaur.id === updatedCentaur.id) {
        return updatedCentaur;
      }
      return centaur;
    });

    const commitId = await updateMemoryDetails(updatedMemoryDetails); // Update the Ceramic stream
    return commitId;
  };

  /**
   * Function to get the updated memory after adding a new tweet proposal
   */
  const getUpdatedCentaurAfterTweetProposal = (tweetDetails) => {
    const tweetList = currentMemoryDetails?.plugins_data?.scheduled_tweet?.tweets || [];
    const updatedTweetList = [...tweetList, tweetDetails];

    const updatedCurrentMemoryDetails = cloneDeep(currentMemoryDetails);
    // setting the updated tweet list in the memory
    set(
      updatedCurrentMemoryDetails,
      'plugins_data.scheduled_tweet.tweets',
      updatedTweetList,
    );

    return updatedCurrentMemoryDetails;
  };

  /**
   * triggers an action on the centaur and updates the memory
   */
  const triggerAction = async (centaurID, action, updatedMemoryDetailsList) => {
    if (!centaurID || !action || !updatedMemoryDetailsList) {
      throw new Error('Arguments missing');
    }

    await addActionToCentaur(centaurID, action, updatedMemoryDetailsList);
    await fetchUpdatedMemory(); // fetch the updated data
  };

  /**
   * checks if an address is present in the members list
   */
  const membersList = currentMemoryDetails?.members || [];
  const isAddressPresent = membersList?.some((member) => {
    const isEqual = areAddressesEqual(member.address, account);
    return isEqual;
  });

  return {
    isMemoryDetailsLoading,
    memoryDetailsList,
    currentMemoryDetails,
    updateMemoryWithNewCentaur,
    fetchUpdatedMemory,
    triggerAction,
    getUpdatedCentaurAfterTweetProposal,
    isAddressPresent,
    membersList,
  };
};

export const useProposals = () => {
  const { currentMemoryDetails } = useCentaurs();

  // 2 million veolas in wei
  const quorumInWei = ethersToWei(`${VEOLAS_QUORUM}`);

  /**
   * check if the current proposal has enough veOLAS to be executed
   */
  const getCurrentProposalInfo = (proposal) => {
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
    const totalVeolasInvestedInPercentage = (
      (totalVeolasInWei * 100n)
      / quorumInWei
    ).toString();

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

  /**
   * Proposals that are not executed and have less than 2 million veolas
   */
  const pendingTweetProposals = currentMemoryDetails?.plugins_data?.scheduled_tweet?.tweets?.filter(
    (proposal) => {
      const { isQuorumAchieved } = getCurrentProposalInfo(proposal);
      return !proposal.execute && !isQuorumAchieved;
    },
  );

  return {
    getCurrentProposalInfo,
    pendingTweetProposals,
  };
};
