import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import {
  Col, Row, Typography,
} from 'antd/lib';
import Actions from './Actions';
import MintNft from './MintNft';
import ConnectTwitterModal from '../ConnectTwitter/Modal';
import { CustomAlert } from './styles';

const { Title } = Typography;
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
          <CustomAlert
            message={(
              <>
                <Title level={2} className="mb-24">
                  Start earning contribution points
                </Title>
                <ConnectTwitterModal />
              </>
            )}
            type="info"
            closable
            onClose={onClose}
          />
        </>
      )}

      <Row gutter={[96, 8]} style={{ marginTop: 12 }}>
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
