import {
  Card, Col, Row, Skeleton, Statistic, Typography,
} from 'antd';
import { getTier } from 'common-util/functions';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const { Text } = Typography;

const ProfileCard = ({ data, isLoading }) => {
  const account = useSelector((state) => state?.setup?.account);
  const profile = data.find((item) => item.wallet_address === account);

  return (
    <>
      <Card
        title="Your Profile"
        extra={
          account && (
            <Link href={`/profile/${account}`}>Full profile &rarr;</Link>
          )
        }
      >
        {
          (isLoading) ? (
            <Skeleton active />
          ) : (
            <>
              {account && (
              <Row gutter={24}>
                <Col>
                  <Statistic title="Rank" value={profile?.rank || 'n/a'} />
                </Col>
                <Col>
                  <Statistic
                    title="Tier"
                    value={profile?.points ? getTier(profile.points) : 'n/a'}
                  />
                </Col>
                <Col>
                  <Statistic title="Points" value={profile?.points || 'n/a'} />
                </Col>
              </Row>
              )}

              {!account && <Text type="secondary">To view profile, connect wallet</Text>}
            </>
          )
        }
      </Card>
    </>
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
