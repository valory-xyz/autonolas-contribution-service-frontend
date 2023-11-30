import { useSelector } from 'react-redux';
import Link from 'next/link';
import {
  Card, Col, Row, Skeleton, Statistic, Typography,
} from 'antd';
import { NA } from '@autonolas/frontend-library';

import { getTier } from 'common-util/functions';

const { Text } = Typography;

export const ProfileCard = () => {
  const account = useSelector((state) => state?.setup?.account);
  const isLoading = useSelector((state) => state?.setup?.isLeaderboardLoading);
  const leaderboard = useSelector((state) => state?.setup?.leaderboard);
  const profile = leaderboard.find((item) => item.wallet_address === account);

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

export default ProfileCard;
