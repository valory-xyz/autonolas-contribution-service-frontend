import {
  Alert, Col, Row, Button,
} from 'antd/lib';
import Leaderboard from './Leaderboard';
// import MintNft from './MintNft';

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

      <Row align="middle">
        <Col xs={24} lg={14}>
          <Leaderboard />
        </Col>
        <Col xs={24} lg={4} className="arrow-image-container">
          <Button type="primary">Mint Badge</Button>
          {/* <MintNft /> */}
        </Col>
      </Row>

    </>
  );
};

export default Home;
