import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { Alert, Col, Row } from 'antd/lib';
import MintNft from './MintNft';
import { DiscordLink } from './common';

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
            message={(
              <>
                To earn your first points, feature on the leaderboard and
                activate your badge,&nbsp;
                <DiscordLink />
                .
              </>
            )}
            type="info"
            closable
            onClose={onClose}
          />
          <br />
        </>
      )}

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
