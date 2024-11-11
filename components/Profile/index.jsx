import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Flex, Card, List, Skeleton, Statistic, Typography } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  NA,
  MEDIA_QUERY,
  COLOR,
  areAddressesEqual,
} from '@autonolas/frontend-library';

import { getName, getTier } from 'common-util/functions';
import TruncatedEthereumLink from 'common-util/TruncatedEthereumLink';
import { getLatestMintedNft } from 'common-util/api';
import { BadgeLoading, ShowBadge } from 'common-util/ShowBadge';
import ConnectTwitterModal from '../ConnectTwitter/Modal';
import { PointsShowcase } from './PointsShowcase';
import { Staking } from './Staking';

const { Title, Text } = Typography;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 880px;
  margin: auto;

  .ant-statistic-content {
    line-height: 1;
  }
`;

const ProfileContent = styled.div`
  display: flex;
  gap: 24px;

  > div:first-child {
    width: 100%;
    max-width: 225px;
  }

  > div:last-child {
    width: 100%;
  }

  ${MEDIA_QUERY.tabletL} {
    flex-direction: column;

    > div:first-child {
      max-width: 100%;
    }
  }
`;

const ProfileBody = ({ profile, id }) => {
  const [isBadgeLoading, setIsBadgeLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const account = useSelector((state) => state?.setup?.account);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsBadgeLoading(true);

        const { details: badgeDetails } = await getLatestMintedNft(
          profile?.wallet_address,
        );
        setDetails(badgeDetails);
      } catch (error) {
        console.error(error);
      } finally {
        setIsBadgeLoading(false);
      }
    };

    getData();
  }, [profile?.wallet_address]);

  const getTwitterHandle = () => {
    if (profile?.twitter_handle) {
      return <Text type="secondary">{profile.twitter_handle}</Text>;
    }
    if (account && areAddressesEqual(id, account)) {
      return (
        <>
          <Text type="secondary">Twitter not connected</Text>
          <ConnectTwitterModal />
        </>
      );
    }
    return NA;
  };

  return (
    <Root>
      <Card bordered={false}>
        <Title level={3} className="mb-32">
          {getName(profile, account)}
        </Title>

        <ProfileContent>
          <div>
            <Title level={5}>Badge</Title>
            {isBadgeLoading ? (
              <BadgeLoading />
            ) : (
              <>
                {details?.image ? (
                  <ShowBadge image={details?.image} tokenId={details?.tokenId} />
                ) : (
                  <Text type="secondary">No badge yet</Text>
                )}
              </>
            )}
            <Title level={5} className="mt-24">Details</Title>
            <List bordered style={{ background: COLOR.WHITE }}>
              <List.Item>
                <Flex vertical gap={8}>
                  <Text>Wallet Address</Text>
                  <TruncatedEthereumLink text={id} />
                </Flex>
              </List.Item>
              <List.Item>
                <Flex vertical gap={8}>
                  <Text>Twitter Handle</Text>
                  {getTwitterHandle()}
                </Flex>
              </List.Item>
            </List>
          </div>

          <div>
            <Title level={5}>
              Leaderboard
            </Title>
            <Flex gap={96} className="mb-24">
              <Statistic
                title="Tier"
                value={profile.points ? getTier(profile.points) : NA}
                formatter={value => <Text className="font-weight-600">{value}</Text>}
              />
              <Statistic
                title="Points"
                value={profile.points ?? NA}
                formatter={value => <Text className="font-weight-600">{value}</Text>}
              />
            </Flex>
            <PointsShowcase tweetsData={profile.tweets} />
          </div>
        </ProfileContent>
      </Card>

      {account && areAddressesEqual(id, account) && <Staking profile={profile}/>}
    </Root>
  );
};

const TweetShape = {
  epoch: PropTypes.number,
  points: PropTypes.number.isRequired,
  campaign: PropTypes.string,
  timestamp: PropTypes.string,
};

ProfileBody.propTypes = {
  profile: PropTypes.shape({
    wallet_address: PropTypes.string,
    discord_handle: PropTypes.string,
    twitter_handle: PropTypes.string,
    service_multisig: PropTypes.string,
    points: PropTypes.number,
    tweets: PropTypes.objectOf(PropTypes.shape(TweetShape)),
  }),
  id: PropTypes.string.isRequired,
};

ProfileBody.defaultProps = {
  profile: {
    wallet_address: '',
    discord_handle: '',
    twitter_handle: '',
    service_multisig: '',
    points: 0,
    tweets: {},
  },
};

export const Profile = () => {
  const router = useRouter();

  const { id } = router.query;
  const data = useSelector((state) => state?.setup?.leaderboard);
  const profile = data.find((item) => item.wallet_address === id);

  if (data?.length === 0) {
    return <Skeleton active />;
  }

  return <ProfileBody profile={profile} id={id} />;
};
