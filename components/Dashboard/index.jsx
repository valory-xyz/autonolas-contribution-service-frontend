import { Col, Row } from 'antd/lib';
import { getLeaderboardList } from 'common-util/api';
import ChatbotCard from 'components/Chatbot/ChatbotCard';
import LeaderboardCard from 'components/Leaderboard/LeaderboardCard';
import MembersCard from 'components/Members/MembersCard';
import ProfileCard from 'components/Profile/ProfileCard';
import TweetCard from 'components/Tweet/TweetCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLeaderboard } from 'store/setup/actions';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const chainId = useSelector((state) => state?.setup?.chainId);
  const data = useSelector((state) => state?.setup?.leaderboard);

  useEffect(() => {
    const fn = async () => {
      try {
        const response = await getLeaderboardList();
        dispatch(setLeaderboard(response));
      } catch (error) {
        window.console.error(error);
      }
    };
    fn();
  }, [chainId]);

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} lg={8} className="mb-24"><LeaderboardCard data={data} isLoading={isLoading} /></Col>
      <Col xs={24} sm={12} lg={8} className="mb-24"><ProfileCard data={data} isLoading={isLoading} /></Col>
      <Col xs={24} sm={12} lg={8} className="mb-24"><MembersCard /></Col>
      <Col xs={24} sm={12} lg={8} className="mb-24"><ChatbotCard /></Col>
      <Col xs={24} sm={12} lg={8} className="mb-24"><TweetCard /></Col>
    </Row>
  );
};

export default Dashboard;
