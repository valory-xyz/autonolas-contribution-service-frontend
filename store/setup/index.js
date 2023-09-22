import orderBy from 'lodash/orderBy';
import lowerCase from 'lodash/lowerCase';
import { apiTypes, syncTypes } from './_types';

const initialState = {
  account: null,
  balance: null,
  chainId: null,
  errorMessage: null,
  /**
   * initially set to true to avoid glitch
   * (util the API is completed)
   */
  isVerified: true,
  leaderboard: [],
  nftDetails: null,

  // memory details
  isMemoryDetailsLoading: true,
  memoryDetails: [],
  predictionRequests: [],
};

export default (state = initialState, action) => {
  const { data } = action;

  switch (action.type) {
    case apiTypes.GET_API: {
      return { ...state, data };
    }

    case syncTypes.SET_ACCOUNT:
    case syncTypes.SET_BALANCE:
    case syncTypes.SET_LOGIN_ERROR:
    case syncTypes.SET_CHAIND_ID:
    case syncTypes.SET_WALLET_VERIFICATION:
    case syncTypes.SET_NFT_DETAILS:
    case syncTypes.SET_MEMORY_DETAILS_LOADING:
    case syncTypes.SET_MEMORY_DETAILS:
    case syncTypes.SET_PREDICTION_REQUESTS:
    case syncTypes.SET_STORE_STATE: {
      return { ...state, ...action.data };
    }

    case syncTypes.SET_LEADERBOARD: {
      const { leaderboard } = action.data;

      // orderBy (sort) 1. points, 2. name
      const values = orderBy(leaderboard, [
        (e) => parseInt(e.points, 10),
        (e) => lowerCase(e.name),
      ], ['desc', 'asc']);

      const rankedValues = [];
      values.forEach((e, index) => {
        // setting rank for the first index
        if (index === 0) {
          rankedValues.push({ ...e, rank: 1 });
        } else {
          const previousMember = rankedValues[index - 1];
          rankedValues.push({
            ...e,
            rank:
              // if points are same as previous member, then same rank else add 1
              previousMember.points === e.points
                ? previousMember.rank
                : previousMember.rank + 1,
          });
        }
      });

      return { ...state, leaderboard: rankedValues };
    }

    case syncTypes.SET_LOGOUT: {
      return {
        ...state,
        account: null,
        balance: null,
        errorMessage: null,
        isVerified: false,
      };
    }

    default:
      return state;
  }
};
