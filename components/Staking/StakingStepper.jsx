import { useState, useEffect } from 'react'
import { AbiCoder } from 'ethers';
import { Flex, Steps, Typography, Button, Radio, Space } from 'antd';
import Link from 'next/link';
import { base, mainnet } from 'viem/chains';
import { useAccount, useSwitchChain } from 'wagmi';
import { notifyError, NA } from '@autonolas/frontend-library';
import { truncateAddress, getAddressFromBytes32, ethersToWei } from 'common-util/functions';
import { CONTRIBUTE_MANAGER_ABI } from 'common-util/AbiAndAddresses';
import { updateUserStakingData } from 'common-util/api';
import { STAKING_CONTRACTS_DETAILS, OPERATE_APP_URL, GOVERN_APP_URL } from 'util/constants';
import ConnectTwitterModal from '../ConnectTwitter/Modal';
import { checkAndApproveOlasForManager, createAndStake } from './requests';

const { Paragraph, Text } = Typography;

const STAKING_STEPS = {
  CONNECT_TWITTER: 0,
  SET_UP_AND_STAKE: 1,
  TWEET_AND_EARN: 2,
}
const STAKING_CONTRACTS = Object.entries(STAKING_CONTRACTS_DETAILS).map(([key, values]) => ({ id: key, ...values }))

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

const SetUpAndStake = ({ disabled, twitterId, multisigAddress, onNextStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [contract, setContract] = useState(null);
  const [multisig, setMultisig] = useState(multisigAddress);

  const { chainId, address: account } = useAccount();
  const { switchChainAsync, switchChain } = useSwitchChain();

  const handleSelectContract = (e) => {
    setContract(e.target.value)
  }

  const handleSetUpAndStake = async () => {
    if (!account) return;
    if (!twitterId) return;

    const selectedContract = STAKING_CONTRACTS_DETAILS[contract];
    if (!selectedContract) return;

    setIsLoading(true);

    try {
      // Switch to base, where we have all the contribute staking contracts
      if (chainId !== base.id) {
        await switchChainAsync({ chainId: base.id });
      }

      // Approve OLAS for Contribute Manager contract
      await checkAndApproveOlasForManager({
        account,
        amountToApprove: ethersToWei(`${selectedContract.totalBond}`),
      })
      
      // Create service and stake
      const result = await createAndStake({
        socialId: twitterId,
        stakingInstance: getAddressFromBytes32(contract)
      })

      if (result) {
        const logs = result.logs;
        const createdAndStakedEvent = logs[logs.length - 1];
        
        // get all non-indexed inputs of CreatedAndStaked event
        const abiInputs = CONTRIBUTE_MANAGER_ABI.find(
          (item) => item.name === "CreatedAndStaked"
        )?.inputs.filter((item) => !item.indexed);
        // decode event data
        const decodedData = AbiCoder.defaultAbiCoder().decode(
          abiInputs.map((item) => item.type),
          createdAndStakedEvent.data,
        );
        // get serviceId from the decoded data
        const serviceId = Number(decodedData[abiInputs.findIndex(item => item.name === 'serviceId')])
        // get multisig address from event topics
        const multisig = getAddressFromBytes32(createdAndStakedEvent.topics[3]);

        // write multisig and serviceId to Ceramic
        updateUserStakingData(twitterId, multisig, `${serviceId}`)

        setMultisig(multisig)
        onNextStep()
      }
    } catch (error) {
      notifyError('Error: could not set up & stake');
      console.error(error);
    } finally {
      setIsLoading(false);

      // Suggest the user to switch back to mainnet to avoid any
      // further errors while they interact with the app
      if (chainId !== mainnet.id) {
        switchChain({ chainId: mainnet.id });
      }
    }
  };


  if (multisig) {
    const selectedContract = STAKING_CONTRACTS_DETAILS[contract];
    return (
      <Flex vertical gap={8}>
        <Text type="secondary">
          Your staking contract:{' '}
          {selectedContract ? (
            <a href={`${GOVERN_APP_URL}/contracts/${contract}`} target="_blank">
              {selectedContract.name} ↗
            </a>
          ) : (
            // TODO: can be NA when go back to this page after finishing set up staking
            // Need to request the contract from the contribute manager
            NA
          )}
        </Text>
        <Text type="secondary">
          Your account address:{' '}
          <a href={`${base.blockExplorers.default.url}/address/${multisig}`} target="_blank">
            {truncateAddress(multisig)} ↗
          </a>
        </Text>
      </Flex>
    )
  }

  return (
    <>
      {!disabled && (
        <>
          <Radio.Group
            onChange={handleSelectContract}
            disabled={disabled}
            value={contract}
            className="mt-12 mb-12"
          >
            <Space direction="vertical">
              {STAKING_CONTRACTS.map((item) => (
                <Radio value={item.id} key={item.id}>
                  <Text className="font-weight-600">{item.name}</Text>
                  <Text type="secondary">
                    {` | ${item.totalBond} OLAS stake | ${
                      item.tweetsPerEpoch
                    } tweet${item.tweetsPerEpoch > 1 ? "s" : ""} per epoch`}
                  </Text>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
          <a href={OPERATE_APP_URL} className="block mb-12" target="_blank">
            Explore contracts on Operate
          </a>
        </>
      )}
      <Paragraph type="secondary">
        You will need to sign two transactions with your wallet to complete this step.
        Ensure you have OLAS and ETH for gas on Base Chain.
      </Paragraph>
      <Button type="primary" disabled={disabled || !contract} loading={isLoading} onClick={handleSetUpAndStake}>
        {isLoading ? 'Setting up staking' : 'Set up & stake'}
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

export const StakingStepper = ({ twitterAccount, twitterId, multisigAddress }) => {
  const [step, setStep] = useState(
    twitterAccount ? STAKING_STEPS.SET_UP_AND_STAKE : STAKING_STEPS.CONNECT_TWITTER
  );

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  useEffect(() => {
    // The leaderboard is re-fetched at intervals in the background.
    // Based on the data updated, we can navigate to next step
    if (multisigAddress) {
      setStep(STAKING_STEPS.TWEET_AND_EARN)
    } else if (twitterAccount) {
      setStep(STAKING_STEPS.SET_UP_AND_STAKE)
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
            title: <Text className="block mb-8">Connect Twitter</Text>,
            description: <ConnectTwitter account={twitterAccount}/>
          },
          {
            key: 'setUpAndStake',
            title: <Text className="block mb-8">Select staking contract, set up on-chain account and stake funds</Text>,
            description: (
              <SetUpAndStake
                disabled={step !== STAKING_STEPS.SET_UP_AND_STAKE}
                twitterId={twitterId}
                multisigAddress={multisigAddress}
                onNextStep={handleNext}
              />
            )
          },
          {
            key: 'tweetAndEarn',
            title: <Text className="block mb-8">Tweet about Olas. Earn points. Earn rewards.</Text>,
            description: <TweetAndEarn disabled={step !== STAKING_STEPS.TWEET_AND_EARN}/>
          }
        ]}
      />
    </Flex>
  )
}