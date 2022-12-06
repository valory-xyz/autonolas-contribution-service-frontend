import dynamic from 'next/dynamic';
import { Alert, Col, Row } from 'antd/lib';
// import Leaderboard from './Leaderboard';
import MintNft from './MintNft';

const Leaderboard = dynamic(() => import('./Leaderboard'));

const Home = () => {
  const onClose = () => {
    console.log('HI');
  };

  return (
    <>
      <Alert
        message="To earn your first points, feature on the leaderboard and activate your badge, link your Discord."
        type="info"
        closable
        onClose={onClose}
      />
      <br />

      <Row gutter={[32, 8]}>
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
