import { Grid, Typography } from 'antd/lib';
import { LeaderboardContent } from './styles';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const getSize = (sizes) => {
  if (sizes.lg) {
    return { width: 920, height: 400 };
  }

  if (sizes.sm) {
    return { width: 640, height: 500 };
  }

  if (sizes.xs) {
    return { width: 320, height: 400 };
  }

  return { width: 920, height: 400 };
};

const Leaderboard = () => {
  const screens = useBreakpoint();
  const { height } = getSize(screens);

  return (
    <>
      <LeaderboardContent className="section">
        <Title level={2}>Leaderboard</Title>
        <Text type="secondary" className="mb-12">
          Climb the leaderboard by completing actions that contribute to
          Autonolas’ success.&nbsp;
          <a
            href="https://www.autonolas.network/"
            target="_blank"
            rel="noreferrer"
          >
            Learn more
          </a>
        </Text>

        <div className="leaderboard-table">
          <iframe
            style={{ width: '100%' }}
            height={height}
            title="leaderboard"
            src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSuZsLhPIkleGOd4LIQL6gmJuZhsF0-6JcsqsVkZ08W5AAmIxkxO41aSUi5Csssf2z9IhfXspYCAy1o/pubhtml?gid=659479338&amp;single=true&amp;widget=true&amp;headers=false"
          />
        </div>

        <Text type="secondary" className="mb-12">
          Not showing on the leaderboard?&nbsp;
          <a
            href="https://discord.gg/4xhAHuy4Y3"
            target="_blank"
            rel="noreferrer"
          >
            Link your Discord
          </a>
        </Text>

        <Title level={2} style={{ marginTop: 12, marginBottom: 4 }}>Actions</Title>
        <Text type="secondary" className="mb-12">
          Complete actions to earn points, climb the leaderboard and upgrade
          your badge.&nbsp;
          <a
            href="https://www.autonolas.network/"
            target="_blank"
            rel="noreferrer"
          >
            Learn more
          </a>
        </Text>
      </LeaderboardContent>
    </>
  );
};

export default Leaderboard;
