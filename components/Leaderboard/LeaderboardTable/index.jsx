import { useSelector } from 'react-redux';
import { Table, Card } from 'antd';
import { EducationTitle } from '../MintNft/Education';
import { LeaderboardContent } from './styles';
import { leaderboardColumns } from './utils';

const Leaderboard = () => {
  const isLoading = useSelector((state) => state?.setup?.isLeaderboardLoading);
  const leaderboard = useSelector((state) => state?.setup?.leaderboard);

  return (
    <LeaderboardContent className="section">
      <EducationTitle
        title="Leaderboard"
        level={3}
        educationItemSlug="leaderboard"
      />

      <Card styles={{ body: { padding: 0 } }}>
        <Table
          columns={leaderboardColumns}
          dataSource={leaderboard}
          loading={isLoading}
          pagination={false}
          scroll={{ y: 600 }}
          virtual
          className="mb-12"
          rowKey="rowKeyUi"
        />
      </Card>
    </LeaderboardContent>
  );
};

export default Leaderboard;
