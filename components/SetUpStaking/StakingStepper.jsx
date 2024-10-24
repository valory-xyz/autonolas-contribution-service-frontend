import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Flex, Steps, Typography, Button, Skeleton } from 'antd';
import Link from 'next/link';
import { notifyError } from '@autonolas/frontend-library';
import { truncateAddress, formatToEth, getAddressFromBytes32 } from 'common-util/functions';
import ConnectTwitterModal from '../ConnectTwitter/Modal';
import { useTotalBond, checkAndApproveOlasForManager, createAndStake } from './requests';
import { base } from 'viem/chains';

const { Paragraph, Text } = Typography;

const ETH_FOR_GAS = 2;
const STAKING_STEPS = {
  CONNECT_TWITTER: 0,
  SET_UP_AND_STAKE: 1,
  TWEET_AND_EARN: 2,
}

const ConnectTwitter = ({ account }) => {
  if (account) {
    return (
      <Text type="secondary">
        Your connected Twitter account:{' '}
        <a href={`https://twitter.com/${account}`} target="_blank">@{account} ↗</a>
      </Text>
    )
  }
  return (
    <>
      <Paragraph type="secondary">
        Link your Twitter account to your Contribute profile.
      </Paragraph>
      <ConnectTwitterModal/>
    </>
  )
}

const SetUpAndStake = ({ disabled, twitterId, onNextStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [multisig, setMultisig] = useState(null);

  const account = useSelector((state) => state?.setup?.account);

  const { totalBond, isLoading: isTotalBondLoading } = useTotalBond()

  const handleSetUpAndStake = async () => {
    if (!account) return;
    if (!twitterId) return;
    if (!totalBond) return;

    setIsLoading(true);

    try {
      await checkAndApproveOlasForManager({
        account,
        amountToApprove: totalBond,
      })
      
      const result = await createAndStake({
        socialId: twitterId,
      })

      if (result) {
        const logs = result.logs;
        const createdAndStakedEvent = logs[logs.length - 1];
        const multisig = getAddressFromBytes32(createdAndStakedEvent.topics[3]);
        // TODO: write multisig to ceramic
        setMultisig(multisig)
        onNextStep()
      }

    } catch (error) {
      notifyError('Error: could not set up & stake');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (multisig) {
    return (
      <Text type="secondary">
        Your Contribute service Safe address:{' '}
        <a href={`${base.blockExplorers.default.url}/address/${multisig}`} target="_blank">
          {truncateAddress(multisig)} ↗
        </a>
      </Text>
    )
  }

  return (
    <>
      <Paragraph type="secondary">
        Ensure you have:
        <ul>
          <li>
            {isTotalBondLoading ? <Skeleton.Button size="small"/> : `${formatToEth(totalBond, 0, 0)}`}{' '}
            OLAS on Base Chain for staking
          </li>
          <li>{ETH_FOR_GAS} ETH on Base Chain for gas</li>
        </ul>
      </Paragraph>
      <Button type="primary" disabled={disabled} loading={isLoading} onClick={handleSetUpAndStake}>
        Set up & stake
      </Button>
    </>
  )
}

const TweetAndEarn = ({ disabled }) => (
  <>
    <Paragraph type="secondary">
      Visit Leaderboard and participate in tweet campaigns to earn points.
      If you earn enough points for the epoch, you could be eligible to earn staking rewards.
    </Paragraph>
    <Link href="/leaderboard">
      <Button type="primary" disabled={disabled}>Visit Leaderboard</Button>
    </Link>
  </>
)

export const StakingStepper = ({ twitterAccount, twitterId }) => {
  const [step, setStep] = useState(
    twitterAccount ? STAKING_STEPS.SET_UP_AND_STAKE : STAKING_STEPS.CONNECT_TWITTER
  );

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  useEffect(() => {
    // TODO: It may take up to 5 minutes to verify if Twitter is connected.
    // If a user connects Twitter on this page, we need to start re-fetching the data at intervals
    // and check if we can navigate to the next step.
    if (twitterAccount) {
      setStep(1)
    }
  }, [twitterAccount])

  return (
    <Flex>
      <Steps
        direction="vertical"
        size="small"
        current={step}
        items={[
          {
            key: 'connectTwitter',
            title: <Text>Connect Twitter</Text>,
            description: <ConnectTwitter account={twitterAccount}/>
          },
          {
            key: 'setUpAndStake',
            title: <Text>Set up on-chain account and stake funds</Text>,
            description: (
              <SetUpAndStake
                disabled={step < STAKING_STEPS.SET_UP_AND_STAKE}
                onNextStep={handleNext}
                twitterId={twitterId}
              />
            )
          },
          {
            key: 'tweetAndEarn',
            title: <Text>Tweet about Olas. Earn points. Earn rewards.</Text>,
            description: <TweetAndEarn disabled={step < STAKING_STEPS.TWEET_AND_EARN}/>
          }
        ]}
      />
    </Flex>
  )
}