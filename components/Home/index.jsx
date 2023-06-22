import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import {
  Alert, Col, Row, Typography,
} from 'antd/lib';
import Actions from 'components/Actions';
import MintNft from './MintNft';
import { DiscordLink } from './common';

const { Text } = Typography;
const Leaderboard = dynamic(() => import('./Leaderboard'));

const Home = () => {
  const isVerified = useSelector((state) => state?.setup?.isVerified);

  const onClose = () => {
    // TODO: store in localstorage
  };

  return (
    <>
      {!isVerified && (
        <>
          <Alert
            className="custom-alert-secondary"
            message={(
              <>
                <Text className="custom-alert-text-secondary">
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
          <div className="mb-48">
            <MintNft />
          </div>
          <Actions />
        </Col>
      </Row>
    </>
  );
};

export default Home;
