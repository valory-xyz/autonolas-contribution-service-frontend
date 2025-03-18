import axios from 'axios';

import {
  PREDICT_APPROVE_ENDPOINT,
  PREDICT_BASE_URL,
  PREDICT_GET_ALL_ENDPOINT,
  PREDICT_PROPOSE_ENDPOINT,
} from 'util/constants';

type Payload = {
  id: string;
  language: string;
  source: string;
  question: string;
  resolution_time: number;
  topic: string;
  answers: string[];
};

export const getPredictionRequests = async () => {
  const response = await axios.get(PREDICT_BASE_URL + PREDICT_GET_ALL_ENDPOINT, {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_PREDICT_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  const requests = response.data.all_markets;
  const prefilteredRequests = Object.keys(requests).map((key) => ({
    ...requests[key],
    key: requests[key].id,
  }));

  const allRequests = prefilteredRequests.filter((market) => market.source === 'contribute');

  const processedRequests = allRequests.filter(
    (market) => market.state === 'PROCESSED' && market.fpmm_id,
  );

  const approvedRequestsCount = allRequests.filter((market) => market.state === 'APPROVED').length;

  return {
    allRequests,
    approvedRequestsCount,
    processedRequests,
  };
};

export const postPredictionRequest = async (payload: Payload) => {
  const headers = {
    Authorization: process.env.NEXT_PUBLIC_PREDICT_API_KEY,
    'Content-Type': 'application/json',
  };

  const response = await axios.post(PREDICT_BASE_URL + PREDICT_PROPOSE_ENDPOINT, payload, {
    headers,
  });

  // Extract the id from the response data
  // Respond structure data.info = "Market ID {id} created successfully."
  const id = response.data.info.split(' ')[2];

  // Make a POST request to the PREDICT_APPROVE_ENDPOINT with the extracted id
  await axios.post(PREDICT_BASE_URL + PREDICT_APPROVE_ENDPOINT, { id }, { headers });
};
