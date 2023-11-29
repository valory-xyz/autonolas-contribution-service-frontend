import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { set } from 'lodash';
import { areAddressesEqual } from '@autonolas/frontend-library';

import { setMemoryDetails } from 'store/setup/actions';
import addActionToCentaur from 'util/addActionToCentaur';
import { DEFAULT_COORDINATE_ID, VEOLAS_QUORUM } from 'util/constants';
import { getMemoryDetails, updateMemoryDetails } from 'common-util/api';
import { ethersToWei, formatToEth } from 'common-util/functions';

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

    // setting the updated tweet list in the memory
    set(
      currentMemoryDetails,
      'plugins_data.scheduled_tweet.tweets',
      updatedTweetList,
    );

    return currentMemoryDetails;
  };

  /**
   * Fetches the updated memory details from Ceramic
   */
  const fetchedUpdatedMemory = async () => {
    const { response: responseAfterUpdate } = await getMemoryDetails();
    dispatch(setMemoryDetails(responseAfterUpdate)); // update the local state with new memory
  };

  /**
   * triggers an action on the centaur and updates the memory
   */
  const triggerAction = async (centaurID, action) => {
    await addActionToCentaur(centaurID, action, memoryDetailsList);
    await fetchedUpdatedMemory(); // Reload the updated data
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
    fetchedUpdatedMemory,
    triggerAction,
    getUpdatedCentaurAfterTweetProposal,
    isAddressPresent,
    membersList,
  };
};

export const useProposals = () => {
  const { currentMemoryDetails } = useCentaurs();

  // 2 million veolas in wei
  const quorum = ethersToWei(`${VEOLAS_QUORUM}`);

  /**
   * check if the current proposal has enough veOLAS to be executed
   */
  const getCurrentProposalInfo = (proposal) => {
    // example of voters: [ { '0x123': '1000000000000000000000000' } ]
    const totalVeolas = proposal?.voters?.reduce((acc, voter) => {
      const currentVeOlas = Object.values(voter)[0]; // veOlas of the current voter in wei
      return acc.add(ethers.BigNumber.from(currentVeOlas));
    }, ethers.BigNumber.from(0));

    // check if voters have 2 million veolas in total
    const isExecutable = totalVeolas.gte(quorum);

    const remainingVeolasForApprovalInEth = formatToEth(
      quorum.sub(totalVeolas),
    );

    // percentage of veolas invested in the proposal
    // limit it to 2 decimal places
    const totalVeolasInvestedInPercentage = totalVeolas
      .mul(ethers.BigNumber.from(100))
      .div(quorum)
      .toString();

    const proposalVerification = proposal?.proposer?.verified;

    return {
      isExecutable,
      totalVeolas,
      totalVeolasInEth: formatToEth(totalVeolas),
      remainingVeolasForApprovalInEth,
      totalVeolasInvestedInPercentage,
      proposalVerification,
    };
  };

  /**
   * Proposals that are not executed and have less than 2 million veolas
   */
  const filteredProposals = currentMemoryDetails?.plugins_data?.scheduled_tweet?.tweets?.filter(
    (proposal) => {
      const { isExecutable } = getCurrentProposalInfo(proposal);
      return !proposal.execute && !isExecutable;
    },
  );

  return {
    getCurrentProposalInfo,
    filteredProposals,
  };
};
