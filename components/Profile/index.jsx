import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Col, List, Result, Row, Skeleton, Statistic, Typography,
} from 'antd';
import PropTypes from 'prop-types';
import { NA } from '@autonolas/frontend-library';

import { getLatestMintedNft } from 'common-util/api';
import { getName, getTier } from 'common-util/functions';
import TruncatedEthereumLink from 'common-util/TruncatedEthereumLink';
import { BadgeLoading, ShowBadge } from 'common-util/ShowBadge';
import { DiscordLink } from '../Leaderboard/common';
import ConnectTwitterModal from '../ConnectTwitter/Modal';

const { Title, Text } = Typography;

const ProfileBody = ({ profile }) => {
  const [isBadgeLoading, setIsBadgeLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const account = useSelector((state) => state?.setup?.account);
  const name = getName(profile);

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

  const getWalletAddress = () => {
    if (profile?.wallet_address) {
      return <TruncatedEthereumLink text={profile.wallet_address} />;
    }
    return NA;
  };

  const getDiscordHandle = () => {
    if (profile?.discord_handle) {
      return <Text type="secondary">{profile.discord_handle}</Text>;
    }
    if (account && account === profile.wallet_address) {
      return <DiscordLink text="Connect Discord" />;
    }
    return NA;
  };

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
      <Title>{name}</Title>

      <Row gutter={48}>
        <Col className="mb-48">
          <Title level={4}>Badge</Title>
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
        </Col>

        <Col xl={12}>
          <div className="mb-48">
            <Title level={4}>Contribution</Title>
            <Row gutter={96}>
              <Col>
                <Statistic
                  title="Tier"
                  value={profile.points ? getTier(profile.points) : NA}
                />
              </Col>
              <Col>
                <Statistic
                  title="Points"
                  value={profile.points ? profile.points : NA}
                />
              </Col>
            </Row>
          </div>
          <div>
            <Title level={4}>Details</Title>
            <List bordered>
              <List.Item>
                <List.Item.Meta
                  title="Wallet Address"
                  description={
                    <Text type="secondary">{getWalletAddress()}</Text>
                  }
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="Discord Handle"
                  description={getDiscordHandle()}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="Twitter Handle"
                  description={getTwitterHandle()}
                />
              </List.Item>
            </List>
          </div>
        </Col>
      </Row>
    </>
  );
};

ProfileBody.propTypes = {
  profile: PropTypes.shape({
    wallet_address: PropTypes.string,
    discord_handle: PropTypes.string,
    twitter_handle: PropTypes.string,
    points: PropTypes.number,
  }),
};

ProfileBody.defaultProps = {
  profile: {
    wallet_address: '',
    discord_handle: '',
    twitter_handle: '',
    points: 0,
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

  if (!profile) {
    return <Result status="warning" title="Profile Not Found" />;
  }

  return <ProfileBody profile={profile} />;
};
