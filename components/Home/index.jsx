import {
  Alert, Col, Row, Button,
} from 'antd/lib';

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

      <Row align="middle">
        <Col xs={24} lg={14}>
          {/* <div style={{ border: '1px solid red', height: '400px' }} /> */}
        </Col>
        <Col xs={24} lg={4} className="arrow-image-container">
          {/* <Button type="primary">Mint Badge</Button> */}
        </Col>
      </Row>
    </>
  );
};

export default Home;
