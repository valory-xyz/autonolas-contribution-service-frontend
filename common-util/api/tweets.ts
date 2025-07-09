import type { ModuleDetails } from 'store/types';
import type { ContributeModuleDetails } from 'types/moduleDetails';
import type { ContributeTweet } from 'types/tweets';

export const getTweetsList = async () => {
  const response = await fetch('/api/tweets');
  const json: ContributeTweet[] = await response.json();
  const tweetsList: ContributeTweet['json_value'][] = [];

  // TODO: consider convenient mapping right inside the api endpoint
  if (json && Array.isArray(json)) {
    json.forEach((tweet) => {
      tweetsList.push(tweet.json_value);
    });
  }

  return tweetsList;
};

export const proposePost = async (updatedModuleDetails: ModuleDetails) => {
  const response = await fetch('/api/propose-post', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedModuleDetails),
  });

  if (!response.ok) {
    throw new Error('Failed to propose tweet');
  }

  const json: ContributeModuleDetails = await response.json();
  return json;
};
