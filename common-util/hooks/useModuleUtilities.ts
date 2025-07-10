import { useDispatch } from 'react-redux';

import { approveExecutePost, proposePost } from 'common-util/api';
import { setModuleDetails, useAppSelector } from 'store/setup';
import type { ScheduledTweet } from 'types/moduleDetails';

export const useModuleUtilities = () => {
  const { moduleDetails, moduleDetailsAttributeId, isModuleDetailsLoading } = useAppSelector(
    (state) => state.setup,
  );
  const dispatch = useDispatch();

  const submitPostProposal = async (post: ScheduledTweet) => {
    const response = await proposePost(post, moduleDetailsAttributeId!);
    dispatch(setModuleDetails(response.json_value));
    return response;
  };

  const submitApprovedExecutedPost = async (post: ScheduledTweet) => {
    const response = await approveExecutePost(post, moduleDetailsAttributeId!);
    dispatch(setModuleDetails(response.json_value));
    return response;
  };

  return {
    moduleDetails,
    isModuleDetailsLoading,
    moduleDetailsAttributeId,
    submitPostProposal,
    submitApprovedExecutedPost,
  };
};
