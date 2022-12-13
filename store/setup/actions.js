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

export const setHealthcheck = (healthcheck) => ({
  type: syncTypes.SET_HEALTH_CHECK,
  data: { healthcheck },
});

export const setLogout = () => ({
  type: syncTypes.SET_LOGOUT,
  data: null,
});
