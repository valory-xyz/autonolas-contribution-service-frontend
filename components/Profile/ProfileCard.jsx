import { useSelector } from 'react-redux';
import Link from 'next/link';
import {
  Card, Col, Row, Skeleton, Statistic, Typography,
} from 'antd';
import PropTypes from 'prop-types';
import { NA } from '@autonolas/frontend-library';

import { getTier } from 'common-util/functions';

const { Text } = Typography;

const ProfileCard = ({ data, isLoading }) => {
  const account = useSelector((state) => state?.setup?.account);
  const profile = data.find((item) => item.wallet_address === account);

  return (
    <Card
      title="Your Profile"
      extra={
        account && <Link href={`/profile/${account}`}>Full profile &rarr;</Link>
      }
    >
      {isLoading ? (
        <Skeleton active />
      ) : (
        <>
          {account && (
            <Row gutter={24}>
              <Col>
                <Statistic title="Rank" value={profile?.rank || NA} />
              </Col>
              <Col>
                <Statistic
                  title="Tier"
                  value={profile?.points ? getTier(profile.points) : NA}
                />
              </Col>
              <Col>
                <Statistic title="Points" value={profile?.points || NA} />
              </Col>
            </Row>
          )}

          {!account && (
            <Text type="secondary">To view profile, connect wallet</Text>
          )}
        </>
      )}
    </Card>
  );
};

ProfileCard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      wallet_address: PropTypes.string.isRequired,
      rank: PropTypes.number,
      points: PropTypes.number,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
};

ProfileCard.defaultProps = {
  isLoading: false,
};

export default ProfileCard;
