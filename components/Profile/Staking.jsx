import { QuestionCircleOutlined, WarningFilled } from '@ant-design/icons';
import { Button, Card, Col, Flex, Row, Skeleton, Tag, Tooltip, Typography } from 'antd';
import { isNil, isNumber } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { base, mainnet } from 'viem/chains';
import { useAccount, useSwitchChain } from 'wagmi';

import { COLOR, NA, notifyError } from '@autonolas/frontend-library';

import { getBytes32FromAddress, truncateAddress } from 'common-util/functions';
import { formatDynamicTimeRange } from 'common-util/functions/time';
import { GOVERN_APP_URL, OLAS_UNICODE_SYMBOL, STAKING_CONTRACTS_DETAILS } from 'util/constants';
import { useAccountServiceInfo, useStakingDetails } from 'util/staking';

import { stake, unstake } from './requests';

const { Title, Text, Paragraph } = Typography;

const ImageContainer = styled.div`
  img {
    position: relative !important;
  }
`;

const HintText = styled(Text)`
  display: block;
  width: max-content;
  color: #606f85;
  margin-top: 4px;
  border-bottom: 1px dashed #606f85;
`;

const TweetCountTooltip = () => (
  <Tooltip
    color={COLOR.WHITE}
    title={
      <>
        <Paragraph>
          Contribute is regularly checking tweets in the background to capture eligible posts.
        </Paragraph>
        <Paragraph>
          Due to Twitter API restrictions, some of your tweets may not be counted.
        </Paragraph>
        <Paragraph className="mb-0">
          Please ensure your tweets are public, include the required tags, and meet all eligibility
          guidelines.
        </Paragraph>
      </>
    }
  >
    <HintText>Why wasn’t my tweet counted?</HintText>
  </Tooltip>
);

const InfoColumn = ({ isLoading, title, value, link, children, comingSoonButtonText }) => {
  let content = null;

  if (isLoading) {
    content = <Skeleton.Input active size="small" />;
  } else {
    if (!isNil(value)) {
      content = <Text className="font-weight-600">{value}</Text>;
    } else if (!isNil(link)) {
      content = (
        <a href={link.href} target="_blank">
          {link.text} ↗
        </a>
      );
    }
  }

  return (
    <Col xs={24} lg={8}>
      <Text type="secondary" className="block mb-4">
        {title}
      </Text>
      {content}
      {children}
      {comingSoonButtonText && (
        <Tooltip title={<Text>Coming soon</Text>} color={COLOR.WHITE}>
          <Button size="small" disabled className="block mt-8">
            {comingSoonButtonText}
          </Button>
        </Tooltip>
      )}
    </Col>
  );
};

const SetupStaking = () => (
  <>
    <ImageContainer>
      <Image src="/images/set-up-staking.png" alt="Staking" layout="fill" objectFit="contain" />
    </ImageContainer>
    <Flex className="mt-24" justify="center">
      <Link href="/staking" passHref>
        <Button type="primary">Set up staking</Button>
      </Link>
    </Flex>
  </>
);

const StakingDetails = ({ profile }) => {
  const { chainId, address: account } = useAccount();
  const { switchChainAsync, switchChain } = useSwitchChain();
  const { data: serviceInfo, isLoading: isServiceInfoLoading } = useAccountServiceInfo(account);

  const [isRestaking, setIsRestaking] = useState(false);

  const serviceId = serviceInfo?.serviceId?.toString() ?? null;
  const contractAddress = serviceInfo?.stakingInstance
    ? getBytes32FromAddress(serviceInfo.stakingInstance)
    : null;
  const contractDetails =
    contractAddress &&
    STAKING_CONTRACTS_DETAILS[getBytes32FromAddress(serviceInfo.stakingInstance)];

  const { data: stakingDetails, isLoading: isStakingDetailsLoading } = useStakingDetails(
    serviceId,
    serviceInfo?.stakingInstance,
  );

  const handleRestake = useCallback(async () => {
    if (!account) return;
    if (!contractDetails) return;
    if (!serviceInfo) return;

    setIsRestaking(true);

    try {
      // Switch to base
      if (chainId !== base.id) {
        await switchChainAsync({ chainId: base.id });
      }

      // First unstake
      await unstake({ account });
      // Then stake to the same contract
      await stake({
        account,
        socialId: profile.twitter_id,
        serviceId,
        stakingInstance: serviceInfo.stakingInstance,
      });
    } catch (error) {
      notifyError('Error: could not restake');
      console.error(error);
    } finally {
      setIsRestaking(false);

      // Suggest the user to switch back to mainnet to avoid any
      // further errors while they interact with the app
      if (chainId !== mainnet.id) {
        switchChain({ chainId: mainnet.id });
      }
    }
  }, [
    account,
    chainId,
    contractDetails,
    profile.twitter_id,
    serviceId,
    serviceInfo,
    switchChain,
    switchChainAsync,
  ]);

  const tweetsMade = useMemo(() => {
    if (!isNumber(stakingDetails.epochCounter)) return 0;
    if (stakingDetails.stakingStatus !== 'Staked') return 0;
    // Only count tweets with campaigns and epoch > than last checkpoint
    return Object.values(profile.tweets).filter(
      (tweet) => tweet.epoch > stakingDetails.epochCounter && tweet.campaign !== null,
    ).length;
  }, [profile, stakingDetails]);

  const stakingStatusColumnData = useMemo(() => {
    if (!serviceInfo) return;

    let value;
    let comingSoonButtonText;
    let children;

    if (stakingDetails.stakingStatus === 'Unstaked') {
      value = 'Not staked';
    }
    if (contractDetails && stakingDetails.stakingStatus === 'Staked') {
      value = `Staked · ${contractDetails.totalBond} OLAS`;
      comingSoonButtonText = 'Unstake';
    }
    if (stakingDetails.stakingStatus === 'Evicted') {
      value = (
        <Flex gap={4}>
          <WarningFilled style={{ color: '#FA8C16' }} />
          Temporarily evicted
          <Tooltip
            color={COLOR.WHITE}
            title={
              <Text>
                You didn&apos;t post enough tweets and missed the epoch target multiple times.
              </Text>
            }
          >
            <QuestionCircleOutlined style={{ color: '#4D596A' }} />
          </Tooltip>
        </Flex>
      );
      if (stakingDetails.isEligibleForStaking) {
        children = (
          <Button
            size="small"
            isLoading={isRestaking}
            onClick={handleRestake}
            className="block mt-8"
          >
            Restake
          </Button>
        );
      } else {
        children = (
          <Tooltip
            title={
              <Text>
                You’ll be able to restake at approximately{' '}
                {formatDynamicTimeRange(stakingDetails.evictionExpiresTimestamp)}.
              </Text>
            }
            color={COLOR.WHITE}
          >
            <Button size="small" disabled className="block mt-8">
              Restake
            </Button>
          </Tooltip>
        );
      }
    }

    return { value, comingSoonButtonText, children };
  }, [
    serviceInfo,
    stakingDetails.stakingStatus,
    stakingDetails.isEligibleForStaking,
    stakingDetails.evictionExpiresTimestamp,
    contractDetails,
    isRestaking,
    handleRestake,
  ]);

  return (
    <>
      <Title level={5}>Rewards</Title>
      <Row gutter={[16, 24]} className="w-100 mb-32">
        <InfoColumn
          title="Tweets made this epoch"
          isLoading={isServiceInfoLoading}
          value={contractDetails ? `${tweetsMade} / ${contractDetails.tweetsPerEpoch}` : undefined}
        >
          {!isServiceInfoLoading && <TweetCountTooltip />}
        </InfoColumn>
        <InfoColumn title="OLAS rewards this epoch" isLoading={isStakingDetailsLoading}>
          {contractDetails && stakingDetails?.rewardsPerEpoch ? (
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
          title="Total OLAS rewards"
          isLoading={isStakingDetailsLoading}
          value={
            stakingDetails.totalRewards !== null
              ? `${OLAS_UNICODE_SYMBOL}${stakingDetails.totalRewards}`
              : undefined
          }
        />
        <InfoColumn
          title="Epoch end time"
          isLoading={isStakingDetailsLoading}
          value={
            stakingDetails.epochEndTimestamp
              ? formatDynamicTimeRange(stakingDetails.epochEndTimestamp)
              : undefined
          }
        />
        <InfoColumn
          title="Epoch length"
          isLoading={isStakingDetailsLoading}
          value={stakingDetails.epochLength ?? undefined}
        />
      </Row>

      <Title level={5}>Details</Title>
      <Row gutter={[16, 24]} className="w-100 mb-32">
        <InfoColumn
          title="Status"
          isLoading={isServiceInfoLoading || isStakingDetailsLoading}
          value={stakingStatusColumnData?.value}
          comingSoonButtonText={stakingStatusColumnData?.comingSoonButtonText}
        >
          {stakingStatusColumnData?.children}
        </InfoColumn>
        <InfoColumn
          title="Staking contract"
          isLoading={isServiceInfoLoading}
          link={
            contractDetails
              ? {
                  href: `${GOVERN_APP_URL}/contracts/${contractAddress}`,
                  text: contractDetails.name,
                }
              : NA
          }
          comingSoonButtonText="Change"
        />
        <InfoColumn
          title="Your Safe address"
          link={{
            href: `${base.blockExplorers.default.url}/address/${profile.service_multisig}`,
            text: truncateAddress(profile.service_multisig),
          }}
        />
      </Row>

      <Title level={5}>Guidelines</Title>
      <Paragraph type="secondary">
        To be eligible to earn rewards, make the required number of tweets each epoch and include at
        least one of the keywords from active campaigns.
      </Paragraph>
      <Link href="/leaderboard">Review active campaigns on Leaderboard</Link>
    </>
  );
};

export const Staking = ({ profile }) => {
  return (
    <Card bordered={false}>
      <Title level={3} className="mb-8">
        Staking
      </Title>
      <Paragraph type="secondary" className="mb-24">
        Staking allows you to earn OLAS rewards when you post about Olas on Twitter.
      </Paragraph>
      {profile.service_multisig ? <StakingDetails profile={profile} /> : <SetupStaking />}
    </Card>
  );
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
    twitter_id: PropTypes.string,
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
    twitter_id: '',
    twitter_handle: '',
    service_multisig: '',
    points: 0,
    tweets: {},
  },
};

StakingDetails.propTypes = Staking.propTypes;
StakingDetails.defaultProps = Staking.defaultProps;
