import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { Col, Row, Typography } from 'antd';

import Actions from './Actions';
// import { MintNft } from './MintNft';
import ConnectTwitterModal from '../ConnectTwitter/Modal';
import { CustomAlert } from './styles';

const { Title } = Typography;
const LeaderboardTable = dynamic(() => import('./LeaderboardTable'));

const EARNING_POINTS_SHOWN = 'start_earning_points_shown';

const Leaderboard = () => {
  const isVerified = useSelector((state) => state?.setup?.isVerified);

  const onClose = () => {
    localStorage.setItem(EARNING_POINTS_SHOWN, 'true');
  };

  return (
    <>
      {!isVerified && localStorage.getItem(EARNING_POINTS_SHOWN) !== 'true' && (
        <CustomAlert
          type="info"
          closable
          onClose={onClose}
          message={(
            <>
              <Title level={2} className="mb-24">
                Start earning points
              </Title>
              <ConnectTwitterModal />
            </>
          )}
        />
      )}

      <Row gutter={[24, 8]}>
        <Col xs={24} lg={14}>
          <LeaderboardTable />
        </Col>
        <Col xs={24} lg={10}>
          {/* <div className="mb-48">
            <MintNft />
          </div> */}
          <Actions />
        </Col>
      </Row>
    </>
  );
};

export default Leaderboard;
