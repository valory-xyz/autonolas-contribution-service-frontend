export async function getLeaderboardList() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard`,
    );
    const json = await response.json();
    return json?.results || [];
  } catch (error) {
    console.error(error);
    return error;
  }
}
