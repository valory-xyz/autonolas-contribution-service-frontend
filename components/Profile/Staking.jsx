import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { base } from 'viem/chains';
import { Flex, Card, Row, Col, Typography, Button, Skeleton, Tooltip, Tag } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNil, isNumber } from 'lodash';
import { getBytes32FromAddress, truncateAddress } from 'common-util/functions';
import { useAccountServiceInfo, useStakingDetails } from 'util/staking'
import { STAKING_CONTRACTS_DETAILS, GOVERN_APP_URL, OLAS_UNICODE_SYMBOL } from 'util/constants';

const { Title, Text, Paragraph } = Typography;

const ImageContainer = styled.div`
  img {
    position: relative !important;
  }
`;

const InfoColumn = ({ isLoading, title, value, link, children, comingSoonButtonText }) => {
  let content = null;

  if (isLoading) {
    content = <Skeleton.Input active size="small"/>
  } else {
    if (!isNil(value)) {
      content = <Text className="font-weight-600">{value}</Text>
    } else if (!isNil(link)) {
      content = (
        <a href={link.href} target="_blank">
          {link.text} ↗
        </a>
      )
    } else if (!isNil(children)) {
      content = children
    }
  }

  return (
    <Col xs={24} lg={8}>
      <Text type="secondary" className="block">{title}</Text>
      {content}
      {comingSoonButtonText && (
        <Tooltip title="Coming soon">
          <Button size="small" disabled className="block mt-8">{comingSoonButtonText}</Button>
        </Tooltip>
      )}
    </Col>
  )
}

const SetupStaking = () => (
  <>
    <ImageContainer>
      <Image
        src="/images/set-up-staking.png"
        alt="Staking"
        layout="fill"
        objectFit="contain"
      />
    </ImageContainer>
    <Flex className="mt-24" justify="center">
      <Link href="/staking" passHref>
        <Button type="primary">Set up staking</Button>
      </Link>
    </Flex>
  </>
)

const StakingDetails = ({ profile }) => {
  const account = useSelector((state) => state?.setup?.account);
  const { data: serviceInfo, isLoading: isServiceInfoLoading } = useAccountServiceInfo(account)

  const serviceId =serviceInfo?.serviceId?.toString() ?? null
  const contractAddress = serviceInfo?.stakingInstance ? getBytes32FromAddress(serviceInfo.stakingInstance) : null
  const contractDetails = contractAddress && STAKING_CONTRACTS_DETAILS[getBytes32FromAddress(serviceInfo.stakingInstance)];

  const { data: stakingDetails, isLoading: isStakingDetailsLoading } =
    useStakingDetails(
      serviceId,
      serviceInfo?.stakingInstance,
    );

  const tweetsMade = useMemo(() => {
    if (isNumber(stakingDetails.epochCounter)) return 0;
    // Only count tweets with campaigns and epoch > than last checkpoint
    return Object.values(profile.tweets).filter(
      (tweet) =>
        tweet.epoch > stakingDetails.epochCounter && tweet.campaign !== null
    ).length;
  }, [profile, stakingDetails]);


  return (
    <>
      <Text type="secondary" className="block">Your account address</Text>
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
        <InfoColumn
          title="Total OLAS rewards"
          isLoading={isStakingDetailsLoading}
          value={stakingDetails.totalRewards !== null ? `${OLAS_UNICODE_SYMBOL}${stakingDetails.totalRewards}` : undefined}
          comingSoonButtonText="Claim"
        />
        <InfoColumn
          title="OLAS staked"
          isLoading={isServiceInfoLoading}
          value={contractDetails ? `${OLAS_UNICODE_SYMBOL}${contractDetails.totalBond}` : undefined}
          comingSoonButtonText="Withdraw"
        />
        <InfoColumn
          title="Staking contract"
          isLoading={isServiceInfoLoading}
          link={contractDetails ? {
            href: `${GOVERN_APP_URL}/contracts/${contractAddress}`,
            text: contractDetails.name,
          } : undefined}
          comingSoonButtonText="Change"
        />
      </Row>

      <Title level={5}>
        Epoch summary
      </Title>
      <Row
        gutter={[16, 16]}
        className="w-100 mb-24"
      >
        <InfoColumn
          title="Tweets made this epoch"
          isLoading={isServiceInfoLoading}
          value={contractDetails ? `${tweetsMade}/${contractDetails.tweetsPerEpoch}` : undefined}
        />
        <InfoColumn
          title="OLAS rewards this epoch"
          isLoading={isStakingDetailsLoading}
        >
         {contractDetails &&
          stakingDetails?.rewardsPerEpoch ? (
            <Flex gap={8} wrap>
              <Text className="font-weight-600">
                {`${OLAS_UNICODE_SYMBOL}${stakingDetails.rewardsPerEpoch}`}
              </Text>
              {tweetsMade >= contractDetails.tweetsPerEpoch ? (
                <Tag color="success">Earned</Tag>
              ) : (
                <Tag color="blue">Not yet earned</Tag>
              )}
            </Flex>
          ) : null}
        </InfoColumn>
        <InfoColumn
          title="Epoch end time"
          isLoading={isStakingDetailsLoading}
          value={stakingDetails.epochEndTimestamp ?
            `~ ${new Date(stakingDetails.epochEndTimestamp * 1000).toLocaleString()}`
          : undefined}
        />
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
    </>
  )
}

export const Staking = ({ profile }) => {
  return (
    <Card bordered={false}>
      <Title level={3} className="mb-8">
        Staking
      </Title>
      <Paragraph type="secondary" className="mb-24">
        Staking allows you to earn OLAS rewards when you post about Olas on Twitter.
      </Paragraph>
      {profile.service_multisig ? <StakingDetails profile={profile}/> : <SetupStaking /> }
    </Card>
  )
};

const TweetShape = {
  epoch: PropTypes.number,
  points: PropTypes.number.isRequired,
  campaign: PropTypes.string,
  timestamp: PropTypes.string,
};

Staking.propTypes = {
  profile: PropTypes.shape({
    wallet_address: PropTypes.string,
    discord_handle: PropTypes.string,
    twitter_handle: PropTypes.string,
    service_multisig: PropTypes.string,
    points: PropTypes.number,
    tweets: PropTypes.objectOf(PropTypes.shape(TweetShape)),
  }),
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

StakingDetails.propTypes = Staking.propTypes
StakingDetails.defaultProps = Staking.defaultProps