import { Card, Table } from 'antd/lib';
import { getLeaderboardList } from 'common-util/api';
import { getName } from 'common-util/functions';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLeaderboard } from 'store/setup/actions';

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

export default LeaderboardCard;
