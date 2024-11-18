import { Col, Row, Typography } from 'antd';
import { useSelector } from 'react-redux';

import ConnectTwitterModal from '../ConnectTwitter/Modal';
import { Campaigns } from './Campaigns';
import { LeaderboardTable } from './LeaderboardTable';
import { TwitterCard } from './styles';

const { Text } = Typography;

const Leaderboard = () => {
  const isVerified = useSelector((state) => state?.setup?.isVerified);

  return (
    <Row gutter={[24, 8]}>
      <Col xs={24} lg={14}>
        {!isVerified && (
          <TwitterCard>
            <Text>Connect Twitter and start earning points</Text>
            <ConnectTwitterModal />
          </TwitterCard>
        )}
        <LeaderboardTable />
      </Col>
      <Col xs={24} lg={10}>
        <Campaigns />
      </Col>
    </Row>
  );
};

export default Leaderboard;
