import { cloneDeep } from 'lodash';

import { getModuleDetails, proposePost } from 'common-util/api';
import { useAppSelector } from 'store/setup';
import type { ModuleDetails } from 'store/types';

export const useModuleDetailsFunctionalities = () => {
  const { moduleDetails, isModuleDetailsLoading } = useAppSelector((state) => state.setup);

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
    const response = await proposePost(updatedModuleDetails);
    return response;
  };

  const fetchUpdatedModuleDetails = async () => {
    const response = await getModuleDetails();
    return response;
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
