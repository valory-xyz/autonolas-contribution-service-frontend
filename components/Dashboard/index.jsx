import { Col, Row } from 'antd';

import ChatbotCard from '../Chatbot/ChatbotCard';
import MembersCard from '../Members/MembersCard';
import TweetCard from '../Tweet/TweetCard';
import { LeaderboardCard } from '../Leaderboard/LeaderboardCard';
import { ProfileCard } from '../Profile/ProfileCard';

const Dashboard = () => (
  <Row gutter={24}>
    <Col xs={24} md={24} lg={12} className="mb-24">
      <LeaderboardCard />
    </Col>
    <Col xs={24} md={24} lg={12} className="mb-24">
      <ProfileCard />
    </Col>
    <Col xs={24} md={24} lg={12} className="mb-24">
      <MembersCard />
    </Col>
    <Col xs={24} md={24} lg={12} className="mb-24">
      <ChatbotCard />
    </Col>
    <Col xs={24} md={24} lg={12} className="mb-24">
      <TweetCard />
    </Col>
  </Row>
);

export default Dashboard;
