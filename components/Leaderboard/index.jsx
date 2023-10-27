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
const LeaderboardTable = dynamic(() => import('./LeaderboardTable'));

const Leaderboard = () => {
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
                  Start earning points
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

      <Row gutter={[24, 8]}>
        <Col xs={24} lg={14}>
          <LeaderboardTable />
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

export default Leaderboard;
