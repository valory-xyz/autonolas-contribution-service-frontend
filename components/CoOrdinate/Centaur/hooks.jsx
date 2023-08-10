import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { set } from 'lodash';

import { getMemoryDetails, updateMemoryDetails } from 'common-util/api';
import { setMemoryDetails } from 'store/setup/actions';
import addActionToCentaur from 'util/addActionToCentaur';
import { DEFAULT_COORDINATE_ID } from 'util/constants';
import { areAddressesEqual } from 'common-util/functions';

export const useCentaursFunctionalities = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const centaurId = router?.query?.id || DEFAULT_COORDINATE_ID;

  const memoryDetailsList = useSelector(
    (state) => state?.setup?.memoryDetails || [],
  );

  const currentMemoryDetails = memoryDetailsList.find((c) => c.id === centaurId) || {};

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
  const isAddressPresent = (address) => membersList?.some((member) => {
    const isEqual = areAddressesEqual(member.address, address);
    return isEqual;
  });

  return {
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
