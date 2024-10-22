import { useState, useEffect } from 'react'
import { Flex, Steps, Typography, Button } from 'antd';
import Link from 'next/link';
import { truncateAddress } from 'common-util/functions';
import ConnectTwitterModal from '../ConnectTwitter/Modal';

const { Paragraph, Text } = Typography;

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

const SetUpAndStake = ({ disabled, onNextStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [multisig, setMultisig] = useState(null);

  // TODO: add contract logic
  const handleSetUpAndStake = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMultisig('0x0001A500A6B18995B03f44bb040A5fFc28E45CB0')
      setIsLoading(false);
      onNextStep()
    }, 3000);
    
  };

  if (multisig) {
    return (
      <Text type="secondary">
        Your contribute service Safe address:{' '}
        <a href={`https://gnosisscan.io/address/${multisig}`} target="_blank">
          {truncateAddress(multisig)} ↗
        </a>
      </Text>
    )
  }

  // TODO: get OLAS amount and chain name from on-chain
  // once staking contracts is created
  return (
    <>
      <Paragraph type="secondary">
        Ensure you have:
        <ul>
          <li>40 OLAS on Gnosis Chain for staking</li>
          <li>2 XDAI on Gnosis Chain for gas</li>
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
      If you earn enough points for the epoch, you might be eligible to earn staking rewards.
    </Paragraph>
    <Link href="/leaderboard">
      <Button type="primary" disabled={disabled}>Visit Leaderboard</Button>
    </Link>
  </>
)

export const StakingStepper = ({ twitterAccount }) => {
  const [step, setStep] = useState(twitterAccount ? 1 : 0);

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
            description: <SetUpAndStake disabled={step < 1} onNextStep={handleNext}/>
          },
          {
            key: 'tweetAndEarn',
            title: <Text>Tweet about Olas. Earn points. Earn rewards.</Text>,
            description: <TweetAndEarn disabled={step < 2}/>
          }
        ]}
      />
    </Flex>
  )
}