import { Card, Flex, List, Skeleton, Statistic, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { COLOR, MEDIA_QUERY, NA, areAddressesEqual } from '@autonolas/frontend-library';

import { BadgeLoading, ShowBadge } from 'common-util/ShowBadge';
import TruncatedEthereumLink from 'common-util/TruncatedEthereumLink';
import { getLatestMintedNft, updateUserStakingData } from 'common-util/api';
import { getName, getTier } from 'common-util/functions';
import { XProfile } from 'types/x';

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

type ProfileBodyProps = {
  profile: XProfile | null;
  id: string;
};

const ProfileBody: React.FC<ProfileBodyProps> = ({ profile, id }) => {
  const [isBadgeLoading, setIsBadgeLoading] = useState(false);
  const [details, setDetails] = useState<{ image: string; tokenId: string } | null>(null);
  // TODO: types
  const account = useSelector((state: any) => state?.setup?.account);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsBadgeLoading(true);
        const { details: badgeDetails } = await getLatestMintedNft(profile?.wallet_address);
        setDetails(badgeDetails);
      } catch (error) {
        console.error(error);
      } finally {
        setIsBadgeLoading(false);
      }
    };

    getData();
  }, [profile?.wallet_address]);

  useEffect(() => {
    updateUserStakingData('twitterId', 'multisig', `${1}`);
  }, []);

  const getTwitterHandle = () => {
    if (profile?.twitter_handle) {
      return <Text type="secondary">{profile.twitter_handle}</Text>;
    }
    if (account && areAddressesEqual(id, account)) {
      return (
        <>
          <Text type="secondary">X not connected</Text>
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
            <Title level={5} className="mt-24">
              Details
            </Title>
            <List bordered style={{ background: COLOR.WHITE }}>
              <List.Item>
                <Flex vertical gap={8}>
                  <Text>Wallet Address</Text>
                  <TruncatedEthereumLink text={id} />
                </Flex>
              </List.Item>
              <List.Item>
                <Flex vertical gap={8}>
                  <Text>X Handle</Text>
                  {getTwitterHandle()}
                </Flex>
              </List.Item>
            </List>
          </div>

          <div>
            <Title level={5}>Leaderboard</Title>
            <Flex gap={96} className="mb-24">
              <Statistic
                title="Tier"
                value={profile?.points ? getTier(profile.points) : NA}
                formatter={(value) => <Text className="font-weight-600">{value}</Text>}
              />
              <Statistic
                title="Points"
                value={profile?.points ?? NA}
                formatter={(value) => <Text className="font-weight-600">{value}</Text>}
              />
            </Flex>
            <PointsShowcase tweetsData={profile?.tweets} />
          </div>
        </ProfileContent>
      </Card>

      {account && areAddressesEqual(id, account) && <Staking profile={profile} />}
    </Root>
  );
};

export const Profile: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const data = useSelector((state: any) => state?.setup?.leaderboard);
  const profile = data.find((item: XProfile) => item.wallet_address === id);

  if (!data || data.length === 0) {
    return <Skeleton active />;
  }

  return <ProfileBody profile={profile} id={id} />;
};
