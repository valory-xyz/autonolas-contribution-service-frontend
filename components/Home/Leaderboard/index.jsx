import { useState, useEffect } from 'react';
import { Typography, Table } from 'antd/lib';
import Link from 'next/link';
import { LinkOutlined } from '@ant-design/icons';
import { COLOR } from '@autonolas/frontend-library';
import { DiscordLink } from '../common';
import { LeaderboardContent } from './styles';

const { Title, Text } = Typography;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Cash Assets',
    className: 'column-money',
    dataIndex: 'money',
    align: 'right',
  },
  {
    title: 'Address',
    dataIndex: 'pointsEarned',
  },
];
const list = [
  {
    key: '1',
    name: 'John Brown',
    money: '￥300,000.00',
    pointsEarned: 5000.5,
  },
  {
    key: '2',
    name: 'Jim Green',
    money: '￥1,256,000.00',
    pointsEarned: 2000,
  },
  {
    key: '3',
    name: 'Joe Black',
    money: '￥120,000.00',
    pointsEarned: 1000,
  },
];
const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setData(list);
    setIsLoading(false);
  }, []);

  return (
    <>
      <LeaderboardContent className="section">
        <Title level={2}>Leaderboard</Title>
        <Text type="secondary" className="custom-text-secondary">
          Climb the leaderboard by completing actions that contribute to
          Autonolas’ success.&nbsp;
          <a
            href="https://www.autonolas.network/blog/introducing-the-community-leaderboard-program"
            target="_blank"
            rel="noreferrer"
          >
            Learn more
          </a>
        </Text>

        <div className="leaderboard-table">
          <Table
            columns={columns}
            dataSource={data}
            bordered
            loading={isLoading}
          />
        </div>
        <Text type="secondary" className="mb-12">
          Not showing on the leaderboard?&nbsp;
          <DiscordLink />
          .
        </Text>

        <Title level={2} style={{ marginTop: 12, marginBottom: 4 }}>
          Actions
        </Title>
        <Text type="secondary" className="custom-text-secondary">
          Complete actions to earn points, climb the leaderboard and upgrade
          your badge.&nbsp;
          <Link href="/docs#section-actions">Learn more</Link>
        </Text>

        <Title level={5} style={{ marginTop: 12, marginBottom: 4 }}>
          <a
            href="https://discord.com/channels/899649805582737479/1030087446882418688/1034340826718937159"
            target="_blank"
            rel="noreferrer"
          >
            See all actions&nbsp;
            <LinkOutlined color={COLOR.BORDER_GREY} />
          </a>
        </Title>
      </LeaderboardContent>
    </>
  );
};

export default Leaderboard;
