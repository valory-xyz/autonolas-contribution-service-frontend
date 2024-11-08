import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { Col, Row, Typography } from 'antd';

// import { MintNft } from './MintNft';
import ConnectTwitterModal from '../ConnectTwitter/Modal';
import { TwitterCard } from './styles';
import { LeaderboardTable } from './LeaderboardTable'
import { Campaigns } from './Campaigns';

const { Text } = Typography;

const EARNING_POINTS_SHOWN = 'start_earning_points_shown';

const Leaderboard = () => {
  const isVerified = useSelector((state) => state?.setup?.isVerified);

  const onClose = () => {
    localStorage.setItem(EARNING_POINTS_SHOWN, 'true');
  };

  return (
    <Row gutter={[24, 8]}>
      <Col xs={24} lg={14}>
        {!isVerified && localStorage.getItem(EARNING_POINTS_SHOWN) !== 'true' && (
          <TwitterCard>
            <Text>
              Connect Twitter and start earning points
            </Text>
            <ConnectTwitterModal />
          </TwitterCard>
        )}
        <LeaderboardTable />
      </Col>
      <Col xs={24} lg={10}>
        {/* <div className="mb-48">
          <MintNft />
        </div> */}
        <Campaigns />
      </Col>
    </Row>
  );
};

export default Leaderboard;
