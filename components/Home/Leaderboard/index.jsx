import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import orderBy from 'lodash/orderBy';
import lowerCase from 'lodash/lowerCase';
import { Typography, Table } from 'antd/lib';
import { LinkOutlined } from '@ant-design/icons';
import { DOCS_SECTIONS } from 'components/Documentation/helpers';
import { DiscordLink } from '../common';
import { getLeaderboardList } from './utils';
import { LeaderboardContent } from './styles';

const { Title, Text } = Typography;

const columns = [
  { title: 'Rank', dataIndex: 'rank' },
  { title: 'Name', dataIndex: 'name' },
  { title: 'Points Earned', dataIndex: 'points' },
];

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const isVerified = useSelector((state) => state?.setup?.isVerified);

  useEffect(() => {
    setIsLoading(true);
    const fn = async () => {
      try {
        const response = await getLeaderboardList();
        setData(response);
        setIsLoading(false);
      } catch (error) {
        window.console.error(error);
      }
    };
    fn();
  }, [chainId]);

  const sortedColumns = () => {
    const values = orderBy(data, [(e) => parseInt(e.points, 10), (e) => lowerCase(e.name)]);

    const rankedValues = [];
    values.forEach((e, index) => {
      // setting rank for the first index
      if (index === 0) {
        rankedValues.push({ ...e, rank: 1 });
      } else {
        const previousMember = rankedValues[index - 1];
        // if points are same as previous member, then same rank else add 1
        rankedValues.push({
          ...e,
          rank:
            previousMember.points === e.points
              ? previousMember.rank
              : previousMember.rank + 1,
        });
      }
    });

    return rankedValues;
  };

  return (
    <>
      <LeaderboardContent className="section">
        <Title level={2}>Leaderboard</Title>
        <Text type="secondary" className="custom-text-secondary">
          Climb the leaderboard by completing actions that contribute to
          Autonolas’ success.&nbsp;
          <Link href={`/docs#${DOCS_SECTIONS.leaderboard}`}>Learn more</Link>
        </Text>

        <div className="leaderboard-table">
          <Table
            columns={columns}
            dataSource={sortedColumns()}
            loading={isLoading}
            bordered
            pagination={false}
            scroll={{ y: 240 }}
            className="mb-12"
          />
        </div>
        {!isVerified && (
          <Text type="secondary" className="mb-12">
            Not showing on the leaderboard?&nbsp;
            <DiscordLink />
            .
          </Text>
        )}

        <Title level={2} style={{ marginTop: 12, marginBottom: 4 }}>
          Actions
        </Title>
        <Text type="secondary" className="custom-text-secondary">
          Complete actions to earn points, climb the leaderboard and upgrade
          your badge.&nbsp;
          <Link href={`/docs#${DOCS_SECTIONS.actions}`}>Learn more</Link>
        </Text>

        <Text style={{ marginTop: 12, marginBottom: 4, display: 'block' }}>
          <a
            href="https://discord.com/channels/899649805582737479/1030087446882418688/1034340826718937159"
            target="_blank"
            rel="noreferrer"
          >
            See all actions&nbsp;
            <LinkOutlined />
          </a>
        </Text>
      </LeaderboardContent>
    </>
  );
};

export default Leaderboard;
