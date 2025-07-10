import { cloneDeep } from 'lodash';
import { useDispatch } from 'react-redux';

import { getModuleDetails, proposeOrUpdatePost } from 'common-util/api';
import { setModuleDetails, useAppSelector } from 'store/setup';
import type { ModuleDetails } from 'store/types';

export const useUpdateModuleDetails = () => {
  const { moduleDetails, moduleDetailsAttributeId, isModuleDetailsLoading } = useAppSelector(
    (state) => state.setup,
  );
  const dispatch = useDispatch();

  const getUpdatedModuleDetailsAfterPostProposal = (
    tweetDetails: ModuleDetails['scheduled_tweet']['tweets'][number],
  ) => {
    if (!moduleDetails) return;

    const updatedModuleDetails = cloneDeep(moduleDetails);
    const updatedTweets = [...(updatedModuleDetails.scheduled_tweet.tweets || []), tweetDetails];
    updatedModuleDetails.scheduled_tweet.tweets = updatedTweets;

    return updatedModuleDetails;
  };

  const getUpdatedModuleDetailsAfterPostMutation = (
    tweetDetails: ModuleDetails['scheduled_tweet']['tweets'][number],
  ) => {
    if (!moduleDetails) return;

    const updatedModuleDetails = cloneDeep(moduleDetails);
    const updatedTweets = updatedModuleDetails.scheduled_tweet.tweets.map((tweet) =>
      tweet.request_id === tweetDetails.request_id ? tweetDetails : tweet,
    );
    updatedModuleDetails.scheduled_tweet.tweets = updatedTweets;

    return updatedModuleDetails;
  };

  const updateModuleDetails = async (updatedModuleDetails: ModuleDetails) => {
    const response = await proposeOrUpdatePost(updatedModuleDetails, moduleDetailsAttributeId!);
    return response;
  };

  const fetchUpdatedModuleDetails = async () => {
    const { moduleDetails } = await getModuleDetails();
    dispatch(setModuleDetails(moduleDetails));
  };

  return {
    moduleDetails,
    isModuleDetailsLoading,
    getUpdatedModuleDetailsAfterPostProposal,
    getUpdatedModuleDetailsAfterPostMutation,
    updateModuleDetails,
    fetchUpdatedModuleDetails,
  };
};
