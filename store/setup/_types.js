const reducerName = 'Setup';

export const apiTypes = {
  GET_API: `${reducerName}/Get API`,
};

export const syncTypes = {
  SET_ACCOUNT: `${reducerName}/Set account`,
  SET_BALANCE: `${reducerName}/Set balance`,
  SET_CHAIND_ID: `${reducerName}/Set chain id`,
  SET_LOGIN_ERROR: `${reducerName}/Set error`,
  SET_WALLET_VERIFICATION: `${reducerName}/Set wallet verification`,
  SET_LOGOUT: `${reducerName}/Set logout`,
  SET_LEADERBOARD: `${reducerName}/Set leaderboard`,
  SET_NFT_DETAILS: `${reducerName}/Set NFT details`,

  // co-ordinate
  SET_MEMORY_DETAILS: `${reducerName}/Set memory details`,
  SET_MEMORY_DETAILS_LOADING: `${reducerName}/Set memory details loading`,

  SET_STORE_STATE: `${reducerName}/Set Store State`,
};
