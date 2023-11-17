import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, List, Row, Skeleton, Statistic, Typography,
} from 'antd';
import PropTypes from 'prop-types';
import { NA } from '@autonolas/frontend-library';

import { setLeaderboard } from 'store/setup/actions';
import { getLatestMintedNft, getLeaderboardList } from 'common-util/api';
import { getName, getTier } from 'common-util/functions';
import TruncatedEthereumLink from 'common-util/TruncatedEthereumLink';
import { DiscordLink } from '../Leaderboard/common';
import { getAutonolasTokenUri } from '../Leaderboard/MintNft/utils';
import ConnectTwitterModal from '../ConnectTwitter/Modal';
import { BadgeCard, IMAGE_SIZE } from './styles';

const { Title, Text } = Typography;

const ProfileBody = ({ profile }) => {
  const [details, setDetails] = useState(null);
  const account = useSelector((state) => state?.setup?.account);
  const name = getName(profile);

  useEffect(async () => {
    const { details: badgeDetails } = await getLatestMintedNft(
      profile?.wallet_address,
    );
    setDetails(badgeDetails);
  }, []);

  return (
    <>
      <Title>{name}</Title>

      <Row gutter={48}>
        <Col className="mb-48">
          <Title level={4}>Badge</Title>
          <BadgeCard>
            {details?.image ? (
              <Image
                src={getAutonolasTokenUri(details.image)}
                alt="Badge image"
                width={IMAGE_SIZE}
                height={IMAGE_SIZE}
                className="nft-image"
                preview={false}
              />
            ) : (
              <Skeleton active />
            )}
          </BadgeCard>
          {details && !details.image && <Text>Badge not minted yet</Text>}
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
                    (
                      <Text type="secondary">
                        <TruncatedEthereumLink text={profile.wallet_address} />
                      </Text>
                    ) || NA
                  }
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="Discord Handle"
                  description={
                    <Text type="secondary">{profile.discord_handle}</Text>
                    || (account && account === profile.wallet_address ? (
                      <DiscordLink text="Connect Discord" />
                    ) : (
                      NA
                    ))
                  }
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="Twitter Handle"
                  description={
                    profile.twitter_handle
                    || (account && account === profile.wallet_address ? (
                      <ConnectTwitterModal />
                    ) : (
                      NA
                    ))
                  }
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

const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { id } = router.query;
  const data = useSelector((state) => state?.setup?.leaderboard);
  const profile = data.find((item) => item.wallet_address === id);

  useEffect(() => {
    const fn = async () => {
      try {
        const response = await getLeaderboardList();
        dispatch(setLeaderboard(response));
      } catch (error) {
        window.console.error(error);
      }
    };
    fn();
  }, []);

  return (
    <>
      {profile ? (
        <ProfileBody profile={profile} />
      ) : (
        <Skeleton loading={!profile} active />
      )}
    </>
  );
};

export default Profile;
