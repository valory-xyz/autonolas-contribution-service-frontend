import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { set } from 'lodash';

import { setMemoryDetails } from 'store/setup/actions';
import addActionToCentaur from 'util/addActionToCentaur';
import { DEFAULT_COORDINATE_ID } from 'util/constants';
import { getMemoryDetails, updateMemoryDetails } from 'common-util/api';
import {
  areAddressesEqual,
  ethersToWei,
  formatToEth,
} from 'common-util/functions';

// const million in eth
const ONE_MILLION = 1000000;
const TWO_MILLION_IN_WEI = ethersToWei(`${ONE_MILLION * 2}`);

export const useCentaursFunctionalities = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const account = useSelector((state) => state?.setup?.account);

  const isMemoryDetailsLoading = useSelector(
    (state) => state?.setup?.isMemoryDetailsLoading,
  );
  const memoryDetailsList = useSelector(
    (state) => state?.setup?.memoryDetails || [],
  );
  const centaurId = router?.query?.id || DEFAULT_COORDINATE_ID;
  const currentMemoryDetails = memoryDetailsList.find((c) => c.id === centaurId) || {};

  /**
   * 2 million veolas in wei
   */
  const quorum = TWO_MILLION_IN_WEI;

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

  /**
   * check if the current proposal has enough veOLAS to be executed
   */
  const getProposalInfo = (proposal) => {
    const votersAddress = proposal.voters?.map(
      (voter) => Object.keys(voter)[0],
    );

    const totalVeOlas = votersAddress?.reduce((acc, voter) => {
      // TODO: remove typeof check once voters are updated
      const currentVeOlas = typeof voter === 'string' ? 0 : Object.values(voter)[0];
      return acc.add(ethers.BigNumber.from(currentVeOlas));
    }, ethers.BigNumber.from(0));

    // check if voters have 2 million veolas in total
    const isExecutable = totalVeOlas.gte(quorum);

    const remainingVeolasForApprovalInEth = formatToEth(
      quorum.sub(totalVeOlas),
    );

    return {
      votersAddress,
      isExecutable,
      totalVeOlas,
      totalVeOlasInEth: formatToEth(totalVeOlas),
      remainingVeolasForApprovalInEth,
    };
  };

  /**
   * Proposals that are not executed and have less than 2 million veolas
   */
  const filteredProposals = currentMemoryDetails?.plugins_data?.scheduled_tweet?.tweets?.filter(
    (proposal) => {
      const { isExecutable } = getProposalInfo(proposal);
      return !proposal.execute && !isExecutable;
    },
  );

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
    getProposalInfo,
    filteredProposals,
  };
};
