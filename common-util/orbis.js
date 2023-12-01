import { Orbis } from '@orbisclub/orbis-sdk';
import { forceIndex } from '@orbisclub/orbis-sdk/utils';
/**
 * Initialize the Orbis class object:
 * You can make this object available on other components
 * by passing it as a prop or by using a context.
 */
const orbis = new Orbis();

export const createPost = async (postContent, orbisArg) => {
  const {
    status: postStatus,
    doc: postId,
    error: postError,
    result: postResult,
  } = await orbisArg.createPost(postContent);
  if (postStatus !== 200) {
    return {
      error: postError || postResult,
      status: postStatus,
    };
  }

  const {
    status: indexingStatus,
    error: indexingError,
    result: indexingResult,
  } = await forceIndex(postId);

  if (indexingStatus !== 200) {
    return {
      error: indexingError || indexingResult,
      status: indexingStatus,
    };
  }

  return {
    postId,
    status: indexingStatus,
    result: indexingResult || postResult,
  };
};

export default orbis;
