import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography, Table, Button, Modal, List, Alert,
} from 'antd/lib';
import { setLeaderboard } from 'store/setup/actions';
import { getLeaderboardList } from 'common-util/api';
import { EducationTitle } from 'components/Education';
import { DiscordLink } from '../common';
import { LeaderboardContent } from './styles';

const { Title, Text } = Typography;

const Leaderboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentWallet, setCurrentWallet] = useState(null);

  const chainId = useSelector((state) => state?.setup?.chainId);
  const account = useSelector((state) => state?.setup?.account);
  const isVerified = useSelector((state) => state?.setup?.isVerified);
  const data = useSelector((state) => state?.setup?.leaderboard);
  const dispatch = useDispatch();

  const handleOpenModal = (wallet) => {
    setCurrentWallet(wallet);
    setIsModalVisible(true);
  };

  const handleCreateTweet = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=I'm linking my wallet to @Autonolas Contribute:%0A${currentWallet}%0A%0ALearn more—${encodeURIComponent(
        'https://contribute.autonolas.network',
      )}`,
      '_blank',
    );
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'Rank', dataIndex: 'rank' },
    {
      title: 'Twitter Handle',
      dataIndex: 'twitter_handle',
      width: 250,
      render: (text, record) => {
        if (record.wallet_address === account && record.twitter_id === null) {
          return (
            <Button
              type="link"
              size="small"
              style={{ padding: 0 }}
              onClick={() => handleOpenModal(record.wallet_address)}
            >
              Link Twitter
            </Button>
          );
        }
        return text || '--';
      },
    },
    {
      title: 'Discord Name',
      dataIndex: 'discord_handle',
      width: 250,
      render: (text) => text || '--',
    },
    { title: 'Points Earned', dataIndex: 'points' },
  ];

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
        <EducationTitle
          title="Leaderboard"
          level={3}
          educationItemSlug="leaderboard"
        />

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
        <Modal
          title="Link Twitter"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleOk}
        >
          <Alert
            type="info"
            showIcon
            className="mb-24"
            message="Linking Twitter will allow you to earn points for tweeting
            about Autonolas."
          />
          <Title level={5} className="mb-12">Instructions</Title>
          <List>
            <List.Item>
              <Text strong>Step 1:</Text>
              <Button type="primary" onClick={handleCreateTweet}>
                Create Tweet
              </Button>
            </List.Item>
            <List.Item>
              <Text strong>Step 2:</Text>
              <Text>Wait up to 5 minutes, then refresh the page</Text>
            </List.Item>
          </List>
        </Modal>
      </LeaderboardContent>
    </>
  );
};

export default Leaderboard;
