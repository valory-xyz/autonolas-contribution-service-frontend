import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import {
  Alert, Col, Row, Typography,
} from 'antd/lib';
import MintNft from './MintNft';
import { DiscordLink } from './common';

const { Text } = Typography;
const Leaderboard = dynamic(() => import('./Leaderboard'));

const Home = () => {
  const isVerified = useSelector((state) => state?.setup?.isVerified);

  // TODO: store in localstorage
  const onClose = () => {
    console.log('HI');
  };

  return (
    <>
      {!isVerified && (
        <>
          <Alert
            className="custom-alert-secondary"
            message={(
              <>
                <Text type="secondary" className="custom-text-secondary">
                  To earn your first points, feature on the leaderboard and
                  activate your badge,&nbsp;
                  <DiscordLink text="complete Discord verification" />
                  .
                </Text>
              </>
            )}
            type="info"
            closable
            onClose={onClose}
          />
        </>
      )}

      <Row gutter={[32, 8]} style={{ marginTop: 12 }}>
        <Col xs={24} lg={14}>
          <Leaderboard />
        </Col>
        <Col xs={24} lg={10}>
          <MintNft />
        </Col>
      </Row>
    </>
  );
};

export default Home;
