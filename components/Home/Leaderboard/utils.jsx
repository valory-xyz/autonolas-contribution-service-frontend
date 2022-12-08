import { getUrl } from 'common-util/functions';

export async function getLeaderboardList(chainId) {
  try {
    const response = await fetch(`${getUrl(chainId)}/leaderboard`);
    const json = await response.json();
    return json?.results || [];
  } catch (error) {
    console.error(error);
    return error;
  }
}
