import { useSelector } from 'react-redux';
import Image from 'next/image';
import { base } from 'viem/chains';
import { Flex, Card, Row, Col, Typography, Button, Skeleton } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getBytes32FromAddress, truncateAddress } from 'common-util/functions';
import { useAccountServiceInfo } from 'util/staking'
import { STAKING_CONTRACTS_DETAILS, GOVERN_APP_URL } from 'util/constants';

const { Title, Text, Paragraph } = Typography;

const ImageContainer = styled.div`
  img {
    position: relative !important;
  }
`;

const StakingLayout = ({ children }) => (
  <Card bordered={false}>
    <Title level={3} className="mb-8">
      Staking
    </Title>
    <Paragraph type="secondary" className="mb-24">
      Staking allows you to earn OLAS rewards when you post about Olas on Twitter.
    </Paragraph>
    {children}
  </Card>
)

export const Staking = ({ profile }) => {
  const account = useSelector((state) => state?.setup?.account);
  const { data, isLoading } = useAccountServiceInfo({ account })
  
  if (!profile.service_multisig) {
    return (
      <StakingLayout>
        <ImageContainer>
          <Image
            src="/images/set-up-staking.png"
            alt="Staking"
            layout='fill'
            objectFit='contain'
          />
        </ImageContainer>
        <Flex className="mt-24" justify="center">
          <Link href="/staking" passHref>
            <Button type="primary">Set up staking</Button>
          </Link>
        </Flex>
      </StakingLayout>
    )
  }

  const contractAddress = data && data.stakingInstance ? getBytes32FromAddress(data.stakingInstance) : null
  const contractDetails = contractAddress && STAKING_CONTRACTS_DETAILS[getBytes32FromAddress(data.stakingInstance)];

  return (
    <StakingLayout>
      <Text type="secondary" className="block">Your account address{' '}</Text>
      <a
        href={`${base.blockExplorers.default.url}/address/${profile.service_multisig}`}
        target="_blank"
        className="block mb-24"
      >
        {truncateAddress(profile.service_multisig)} ↗
      </a>
      <Row
        gutter={[16, 16]}
        className="w-100 mb-24"
      >
        <Col span={8}>
          <Text type="secondary" className="block">OLAS staked</Text>
          {isLoading && <Skeleton.Input active />}
          {contractDetails && contractDetails.totalBond}
        </Col>
        <Col span={8}>
          <Text type="secondary" className="block">Staking contract</Text>
          {isLoading && <Skeleton.Input active />}
          {contractDetails && (
            <a href={`${GOVERN_APP_URL}/contracts/${contractAddress}`} target="_blank">
              {contractDetails.name} ↗
            </a>
          )}
        </Col>
      </Row>
      <Title level={5}>
        Guidelines
      </Title>
      <Paragraph type="secondary">
        To be eligible to earn rewards, make the required number of tweets each epoch and include at
        least one of the keywords from active campaigns.
      </Paragraph>
      <Link href="/leaderboard">
        Review active campaigns on Leaderboard
      </Link>
    </StakingLayout>
  );
};

Staking.propTypes = {
  profile: PropTypes.shape({
    wallet_address: PropTypes.string,
    discord_handle: PropTypes.string,
    twitter_handle: PropTypes.string,
    service_multisig: PropTypes.string,
    points: PropTypes.number,
    tweets: PropTypes.objectOf(PropTypes.number),
  }),
  id: PropTypes.string.isRequired,
};

Staking.defaultProps = {
  profile: {
    wallet_address: '',
    discord_handle: '',
    twitter_handle: '',
    service_multisig: '',
    points: 0,
    tweets: {},
  },
};