import { syncTypes } from './_types';

export const setUserAccount = (account) => ({
  type: syncTypes.SET_ACCOUNT,
  data: { account },
});

export const setUserBalance = (balance) => ({
  type: syncTypes.SET_BALANCE,
  data: { balance },
});

export const setChainId = (chainId) => ({
  type: syncTypes.SET_CHAIND_ID,
  data: { chainId },
});

export const setErrorMessage = (errorMessage) => ({
  type: syncTypes.SET_LOGIN_ERROR,
  data: { errorMessage },
});

export const setIsVerified = (isVerified) => ({
  type: syncTypes.SET_WALLET_VERIFICATION,
  data: { isVerified },
});

export const setLeaderboard = (leaderboard) => ({
  type: syncTypes.SET_LEADERBOARD,
  data: { leaderboard },
});

export const setNftDetails = (nftDetails) => ({
  type: syncTypes.SET_NFT_DETAILS,
  data: { nftDetails },
});

export const setIsMemoryDetailsLoading = (isMemoryDetailsLoading) => ({
  type: syncTypes.SET_MEMORY_DETAILS_LOADING,
  data: { isMemoryDetailsLoading },
});

export const setMemoryDetails = (memoryDetails) => ({
  type: syncTypes.SET_MEMORY_DETAILS,
  data: { memoryDetails },
});

export const setLogout = () => ({
  type: syncTypes.SET_LOGOUT,
  data: null,
});

export const setPredictionRequests = (predictionRequests) => ({
  type: syncTypes.SET_PREDICTION_REQUESTS,
  data: { predictionRequests },
});
