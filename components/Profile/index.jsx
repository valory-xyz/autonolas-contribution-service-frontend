import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Flex, List, Skeleton, Statistic, Typography, Button } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  NA,
  // notifyError,
  MEDIA_QUERY,
  COLOR,
  areAddressesEqual,
} from '@autonolas/frontend-library';

import { getName, getTier } from 'common-util/functions';
import TruncatedEthereumLink from 'common-util/TruncatedEthereumLink';
import { getLatestMintedNft } from 'common-util/api';
import { BadgeLoading, ShowBadge } from 'common-util/ShowBadge';
// import useOrbis from 'common-util/hooks/useOrbis';
// import { checkOrbisStatus } from 'common-util/orbis';
// import { DiscordLink } from '../Leaderboard/common';
import ConnectTwitterModal from '../ConnectTwitter/Modal';
// import { UpdateUsername } from './UpdateUsername';
import { PointsShowcase } from './PointsShowcase';

const { Title, Text, Paragraph } = Typography;

const ProfileContent = styled.div`
  display: flex;
  gap: 24px;

  > div:first-child {
    width: 100%;
    max-width: 300px;
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
  // const [orbisProfile, setOrbisProfile] = useState(false);
  const [isBadgeLoading, setIsBadgeLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const account = useSelector((state) => state?.setup?.account);
  // const { getProfile: getOrbisProfile, isLoading: isOrbisLoading } = useOrbis();

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

  // const loadOrbisProfile = useCallback(
  //   async (delay) => {
  //     if (delay) {
  //       await new Promise((resolve) => {
  //         setTimeout(resolve, 300);
  //       });
  //     }

  //     const res = await getOrbisProfile(id);
  //     if (checkOrbisStatus(res?.status)) {
  //       setOrbisProfile(res?.data);
  //       return res;
  //     }
  //     const ERROR_MESSAGE = "Couldn't load Orbis profile.";
  //     notifyError(ERROR_MESSAGE);
  //     console.error(ERROR_MESSAGE, res);
  //     setOrbisProfile(null);
  //     return null;
  //   },
  //   [id, getOrbisProfile],
  // );

  // useEffect(() => {
  //   loadOrbisProfile();
  // }, [loadOrbisProfile]);

  // const getDiscordHandle = () => {
  //   if (profile?.discord_handle) {
  //     return <Text type="secondary">{profile.discord_handle}</Text>;
  //   }
  //   if (account && account === profile.wallet_address) {
  //     return <DiscordLink text="Connect Discord" />;
  //   }
  //   return NA;
  // };

  const getTwitterHandle = () => {
    if (profile?.twitter_handle) {
      return <Text type="secondary">{profile.twitter_handle}</Text>;
    }
    if (account && account === profile.wallet_address) {
      return <ConnectTwitterModal />;
    }
    return NA;
  };

  return (
    <>
      <div style={{ height: 75 }}>
        {/* <Skeleton loading={isOrbisLoading} title paragraph={false} active>
          <div style={{ display: 'flex' }}>
            <Title level={3} style={{ maxWidth: 500, marginRight: 16 }}>
              {orbisProfile?.username || 'Unknown Olassian'}
            </Title>
            <UpdateUsername loadOrbisProfile={loadOrbisProfile} id={id} />
          </div>
        </Skeleton> */}
        <Title level={3} style={{ maxWidth: 500, marginRight: 16 }}>
          {getName(profile)}
        </Title>
      </div>

      <ProfileContent>
        <div className="mb-48">
          <Title level={5}>Badge</Title>
          {isBadgeLoading ? (
            <BadgeLoading />
          ) : (
            <>
              {details?.image ? (
                <ShowBadge image={details?.image} tokenId={details?.tokenId} />
              ) : (
                <Text>Badge not minted yet</Text>
              )}
            </>
          )}

          <div className="mt-24">
            <Title level={5}>Details</Title>
            <List bordered style={{ background: COLOR.WHITE }}>
              <List.Item>
                <List.Item.Meta
                  title="Wallet Address"
                  description={<TruncatedEthereumLink text={id} />}
                />
              </List.Item>
              {/* <List.Item>
                <List.Item.Meta
                  title="Discord Handle"
                  description={getDiscordHandle()}
                />
              </List.Item> */}
              <List.Item>
                <List.Item.Meta
                  title="Twitter Handle"
                  description={getTwitterHandle()}
                />
              </List.Item>
            </List>
          </div>
        </div>

        <div>
          {areAddressesEqual(id, account) && !profile.service_multisig && 
            <>
              <Title level={5}>Staking</Title>
              <Paragraph type="secondary">
                Staking allows you to earn OLAS rewards when you complete actions
                and earn leaderboard points.
              </Paragraph>
              <Link href="/set-up-staking">
                <Button type="primary">Set up staking</Button>
              </Link>
            </>
          }
          <Title level={5} className="mt-24">
            Contribution
          </Title>
          <Flex gap={96}>
            <Statistic
              title="Tier"
              value={profile.points ? getTier(profile.points) : NA}
            />
            <Statistic title="Points" value={profile.points ?? NA} />
          </Flex>
          <PointsShowcase tweetIdToPoints={profile.tweet_id_to_points} />
        </div>
      </ProfileContent>
    </>
  );
};

ProfileBody.propTypes = {
  profile: PropTypes.shape({
    wallet_address: PropTypes.string,
    discord_handle: PropTypes.string,
    twitter_handle: PropTypes.string,
    service_multisig: PropTypes.string,
    points: PropTypes.number,
    tweet_id_to_points: PropTypes.objectOf(PropTypes.number),
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
    tweet_id_to_points: {},
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
