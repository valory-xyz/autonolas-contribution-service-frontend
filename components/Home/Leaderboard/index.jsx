import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { Typography, Table } from 'antd/lib';
import { LinkOutlined } from '@ant-design/icons';

import { setLeaderboard } from 'store/setup/actions';
import { getLeaderboardList } from 'common-util/api';
import { DOCS_SECTIONS } from 'components/Documentation/helpers';
import { DiscordLink } from '../common';
import { LeaderboardContent } from './styles';

const { Title, Text } = Typography;

const columns = [
  { title: 'Rank', dataIndex: 'rank' },
  {
    title: 'Twitter Handle',
    dataIndex: 'twitter_handle',
    width: 250,
    render: (text) => text || '--',
  },
  {
    title: 'Discord Name',
    dataIndex: 'discord_handle',
    width: 250,
    render: (text) => text || '--',
  },
  { title: 'Points Earned', dataIndex: 'points' },
];

const Actions = () => (
  <>
    <Title level={2}>Actions</Title>
    <Text type="secondary" className="custom-text-secondary">
      Complete actions to earn points, climb the leaderboard and upgrade your
      badge.&nbsp;
      <Link href={`/docs#${DOCS_SECTIONS.actions}`}>Learn more</Link>
    </Text>

    <Text style={{ display: 'block' }}>
      <a
        href="https://discord.com/channels/899649805582737479/1030087446882418688/1034340826718937159"
        target="_blank"
        rel="noreferrer"
      >
        See all actions&nbsp;
        <LinkOutlined />
      </a>
    </Text>
  </>
);

const Leaderboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const isVerified = useSelector((state) => state?.setup?.isVerified);
  const data = useSelector((state) => state?.setup?.leaderboard);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    const fn = async () => {
      try {
        const response = await getLeaderboardList();
        dispatch(setLeaderboard(response));
        setIsLoading(false);
      } catch (error) {
        window.console.error(error);
      }
    };
    fn();
  }, [chainId]);

  return (
    <>
      <LeaderboardContent className="section">
        {/* actions */}
        <Actions />

        {/* leaderboard */}
        <Title level={2}>Leaderboard</Title>
        <Text type="secondary" className="custom-text-secondary">
          Climb the leaderboard by completing actions that contribute to
          Autonolas’ success.&nbsp;
          <Link href={`/docs#${DOCS_SECTIONS.leaderboard}`}>Learn more</Link>
        </Text>

        <div className="leaderboard-table">
          <Table
            columns={columns}
            dataSource={data}
            loading={isLoading}
            bordered
            pagination={false}
            className="mb-12"
            rowKey="rowKeyUi"
          />
        </div>
        {!isVerified && (
          <Text type="secondary" className="mb-12">
            If you had points on the old leaderboard your points should
            automatically migrate after you&nbsp;
            <DiscordLink text="complete Discord verification" />
            . If they
            don’t,&nbsp;
            <a
              href="https://discord.com/invite/z2PT65jKqQ"
              target="_blank"
              rel="noreferrer"
            >
              join the Discord
            </a>
            &nbsp;and let us know.
          </Text>
        )}
      </LeaderboardContent>
    </>
  );
};

export default Leaderboard;
