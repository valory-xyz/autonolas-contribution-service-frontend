import { Card, Table } from 'antd';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import { EducationTitle } from 'common-util/Education/EducationTitle';
import { getName } from 'common-util/functions';

export const LeaderboardCard = () => {
  const isLoading = useSelector((state) => state?.setup?.isLeaderboardLoading);
  const leaderboard = useSelector((state) => state?.setup?.leaderboard);
  const limitedLeaderboardList = leaderboard.slice(0, 5);

  const columns = [
    { title: 'Rank', dataIndex: 'rank', width: 50 },
    {
      title: 'Name',
      width: 250,
      render: (record) =>
        <Link href={`/profile/${record.wallet_address}`}>{getName(record)}</Link> || '--',
    },
  ];

  return (
    <Card
      title={<EducationTitle title="Leaderboard – Top 5" educationItem="leaderboard" level={5} />}
      bodyStyle={{ padding: 0 }}
      extra={<Link href="/leaderboard">See all &rarr;</Link>}
      actions={[
        <Link href="/leaderboard" key="leaderboard">
          Start earning points
        </Link>,
      ]}
    >
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
