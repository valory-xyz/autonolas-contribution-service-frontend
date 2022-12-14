import axios from 'axios';

export async function getLeaderboardList() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard`);
    return response?.data?.results || [];
  } catch (error) {
    console.error(error);
  }
  return null;
}
