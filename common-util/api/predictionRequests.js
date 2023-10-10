import axios from 'axios';
import {
  PREDICT_APPROVE_ENDPOINT, PREDICT_BASE_URL, PREDICT_GET_ALL_ENDPOINT, PREDICT_PROPOSE_ENDPOINT,
} from 'util/constants';

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

  // const allRequests = prefilteredRequests.filter(
  //   (market) => market.source === 'contribute',
  // );

  const allRequests = [
    {
      answers: [
        'Yes',
        'No',
      ],
      id: '0xee062891c7590a2cefe4f2166ecdb10ea126061e',
      language: 'en_US',
      question: "Will Olas DAO's latest round of bonding products be fully consumed by the end of 30 September 2023?",
      resolution_time: 1696114799,
      source: 'contribute',
      state: 'APPROVED',
      topic: 'olas',
    },
    {
      answers: [
        'Yes',
        'No',
      ],
      id: '0xee062891c7590a2cefe4f2166ecdb10ea126061e',
      language: 'en_US',
      question: "Will Olas DAO's latest round of bonding products be fully consumed by the end of 30 September 2023?",
      resolution_time: 1696114799,
      source: 'contribute',
      state: 'PROCESSED',
      topic: 'olas',
    },
    {
      answers: [
        'Yes',
        'No',
      ],
      id: '0xa07b86ce047420d1760416179b3f592f36cc740a',
      language: 'en_US',
      question: "Will Olas DAO's latest round of bonding products be fully consumed by the end of 30 September 2023?",
      resolution_time: 1696114799,
      source: 'contribute',
      state: 'PROCESSED',
      topic: 'olas',
    },
  ];

  const processedRequests = allRequests.filter(
    (market) => market.state === 'PROCESSED',
  );

  const approvedRequestsCount = allRequests.filter(
    (market) => market.state === 'APPROVED',
  ).length;

  return {
    allRequests,
    approvedRequestsCount,
    processedRequests,
  };
};

export const postPredictionRequest = async (payload) => {
  const headers = {
    Authorization: process.env.NEXT_PUBLIC_PREDICT_API_KEY,
    'Content-Type': 'application/json',
  };

  const response = await axios.post(
    PREDICT_BASE_URL + PREDICT_PROPOSE_ENDPOINT,
    payload,
    { headers },
  );

  const { id } = response.data;

  await axios.post(PREDICT_BASE_URL + PREDICT_APPROVE_ENDPOINT, { id }, { headers });
};
