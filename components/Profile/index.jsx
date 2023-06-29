import {
  Card,
  Col,
  List,
  Row,
  Skeleton,
  Statistic,
  Typography,
} from 'antd/lib';
import { getLatestMintedNft } from 'common-util/api';
import { getName, getTier } from 'common-util/functions';
import ConnectTwitterModal from 'components/ConnectTwitter/Modal';
import { getAutonolasTokenUri } from 'components/Home/MintNft/utils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
        <Col>
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
            ) : <Skeleton.Image active className="skeleton-image-loader" />}
          </BadgeCard>
          {(details && !details.image) && <Text>Badge not minted yet</Text>}
        </Col>
        <Col xl={12}>
          <div className="mb-48">
            <Title level={4}>Contribution</Title>
            <Row gutter={96}>
              <Col>
                <Statistic
                  title="Tier"
                  value={profile.points ? getTier(profile.points) : 'n/a'}
                />
              </Col>
              <Col>
                <Statistic
                  title="Points"
                  value={profile.points ? profile.points : 'n/a'}
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
                  description={profile.wallet_address || 'n/a'}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="Discord Handle"
                  description={profile.discord_handle || ((account && account === profile.wallet_address) ? 'Link Discord' : 'n/a')}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="Twitter Handle"
                  description={profile.twitter_id || ((account && account === profile.wallet_address) ? <ConnectTwitterModal /> : 'n/a')}
                />
              </List.Item>
            </List>
          </div>
        </Col>
      </Row>
    </>
  );
};

const Profile = () => {
  const router = useRouter();
  const { id } = router.query;
  const data = useSelector((state) => state?.setup?.leaderboard);
  const profile = data.find((item) => item.wallet_address === id);

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
