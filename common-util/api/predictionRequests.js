import axios from 'axios';
import { PREDICT_BASE_URL, PREDICT_GET_ALL_ENDPOINT } from 'util/constants';

export const getPredictionRequests = async () => {
  const response = await axios.get(PREDICT_BASE_URL + PREDICT_GET_ALL_ENDPOINT, {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_PREDICT_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  const markets = response.data.all_markets;
  const prefilteredRequests = Object.keys(markets).map((key) => ({
    ...markets[key],
    key: markets[key].id,
  }));

  const requests = prefilteredRequests.filter(
    (market) => market.source === 'contribute',
  );

  return requests;
};
