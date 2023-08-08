import { Card, Table } from 'antd/lib';
import { getName } from 'common-util/functions';
import Link from 'next/link';
import PropTypes from 'prop-types';

const LeaderboardCard = ({ data, isLoading }) => {
  const limitedLeaderboardList = data.slice(0, 5);

  const columns = [
    { title: 'Rank', dataIndex: 'rank', width: 50 },
    {
      title: 'Name',
      width: 250,
      render: (record) => (
        <Link href={`/profile/${record.wallet_address}`}>
          {getName(record)}
        </Link>
      ) || '--',
    }];

  return (
    <Card title="Leaderboard – Top 5" bodyStyle={{ padding: 0 }} extra={<Link href="/leaderboard">See all &rarr;</Link>} actions={[<Link href="/leaderboard">Start earning points</Link>]}>
      <Table
        columns={columns}
        size="small"
        dataSource={limitedLeaderboardList}
        loading={isLoading}
        bordered={false}
        pagination={false}
        rowKey="rowKeyUi"
      />
    </Card>
  );
};

LeaderboardCard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      wallet_address: PropTypes.string.isRequired,
      rank: PropTypes.number,
      points: PropTypes.number,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
};

LeaderboardCard.defaultProps = {
  isLoading: false,
};
export default LeaderboardCard;
