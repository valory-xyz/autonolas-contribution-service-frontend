import { Button, Flex, Radio, RadioChangeEvent, Skeleton, Space, Steps, Typography } from 'antd';
import { AbiCoder, ZeroAddress } from 'ethers';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { base, mainnet } from 'viem/chains';
import { useAccount, useSwitchChain } from 'wagmi';

import { areAddressesEqual, notifyError } from '@autonolas/frontend-library';

import { CONTRIBUTORS_V2_ABI, CONTRIBUTORS_V2_ADDRESS_BASE } from 'common-util/AbiAndAddresses';
import { updateUserStakingData } from 'common-util/api';
import { ethersToWei, getAddressFromBytes32, truncateAddress } from 'common-util/functions';
import { XProfile } from 'types/x';
import { GOVERN_APP_URL, OPERATE_APP_URL, STAKING_CONTRACTS_DETAILS } from 'util/constants';
import { useServiceInfo } from 'util/staking';

import ConnectTwitterModal from '../ConnectTwitter/Modal';
import { checkAndApproveOlasForAddress, checkHasEnoughOlas, createAndStake } from './requests';

const { Paragraph, Text } = Typography;

const STAKING_STEPS = {
  CONNECT_TWITTER: 0,
  SET_UP_AND_STAKE: 1,
  TWEET_AND_EARN: 2,
};

const STAKING_CONTRACTS = Object.entries(STAKING_CONTRACTS_DETAILS)
  .filter(([_, values]) => !values.isDeprecated)
  .map(([key, values]) => ({
    id: key,
    ...values,
  }));

const ConnectTwitter = ({ account }: { account: string | null }) => {
  if (account) {
    return (
      <Text type="secondary">
        Your connected X account:{' '}
        <a href={`https://x.com/${account}`} target="_blank">
          @{account} ↗
        </a>
      </Text>
    );
  }
  return (
    <>
      <Paragraph type="secondary">Link your X account to your Contribute profile.</Paragraph>
      <ConnectTwitterModal />
    </>
  );
};

const SetUpAndStake = ({
  disabled,
  twitterId,
  multisigAddress,
  onNextStep,
}: {
  disabled: boolean;
  twitterId: string | null;
  multisigAddress: string | null;
  onNextStep: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [contract, setContract] = useState<Address | null>(null);
  const [multisig, setMultisig] = useState(multisigAddress);

  const { chainId, address: account } = useAccount();
  const { switchChainAsync, switchChain } = useSwitchChain();

  const { data: serviceInfo, isLoading: isServiceInfoLoading } = useServiceInfo({
    account,
    isNew: true,
  });

  useEffect(() => {
    if (multisigAddress) {
      setMultisig(multisigAddress);
    }
  }, [multisigAddress]);

  useEffect(() => {
    if (serviceInfo && !areAddressesEqual(serviceInfo.stakingInstance, ZeroAddress)) {
      setContract(serviceInfo.stakingInstance);
    }
  }, [serviceInfo]);

  useEffect(() => {
    // In case the service info wasn't written to Ceramic, but the service was created,
    // try writing it again
    if (serviceInfo && !areAddressesEqual(serviceInfo.multisig, ZeroAddress) && !multisigAddress) {
      updateUserStakingData(twitterId, serviceInfo.multisig, `${serviceInfo.serviceId}`).then(
        () => {
          setMultisig(serviceInfo.multisig);
        },
      );
    }
  }, [serviceInfo, multisigAddress, twitterId]);

  const handleSelectContract = (e: RadioChangeEvent) => {
    setContract(e.target.value);
  };

  const handleSetUpAndStake = async () => {
    if (!account) return;
    if (!contract) return;
    if (!twitterId) return;

    const selectedContract = STAKING_CONTRACTS_DETAILS[contract];

    if (!selectedContract) return;
    if (selectedContract.isDeprecated) {
      notifyError('Selected contract is deprecated!');
      return;
    }

    setIsLoading(true);

    try {
      // Switch to base, where we have all the contribute staking contracts
      if (chainId !== base.id) {
        await switchChainAsync({ chainId: base.id });
      }

      const olasRequiredInWei = ethersToWei(`${selectedContract.totalBond}`);

      // Check that user has enough OLAS
      const hasEnoughOlas = await checkHasEnoughOlas({ account, amountInWei: olasRequiredInWei });
      if (!hasEnoughOlas) {
        notifyError("Error: you don't have enough OLAS to continue");
        return;
      }

      // Approve OLAS for Contributors contract
      await checkAndApproveOlasForAddress({
        account,
        addressToApprove: CONTRIBUTORS_V2_ADDRESS_BASE,
        amountToApprove: olasRequiredInWei,
      });

      // Create service and stake
      const result = await createAndStake({
        account,
        socialId: twitterId,
        stakingInstance: contract,
      });

      if (!result) return;

      const logs = result.logs;
      const createdAndStakedEvent = logs[logs.length - 1];

      // get all non-indexed inputs of CreatedAndStaked event
      const abiInputs =
        CONTRIBUTORS_V2_ABI.find(
          (item) => 'name' in item && item.name === 'CreatedAndStaked',
        )?.inputs.filter((item) => 'indexed' in item && !item.indexed) || [];
      // decode event data
      const decodedData = AbiCoder.defaultAbiCoder().decode(
        abiInputs.map((item) => item.type),
        createdAndStakedEvent.data,
      );
      // get serviceId from the decoded data
      const serviceId = Number(
        decodedData[abiInputs.findIndex((item) => item.name === 'serviceId')],
      );
      // get multisig address from event topics
      const multisig = getAddressFromBytes32(createdAndStakedEvent.topics[3]);

      // write multisig and serviceId to Ceramic
      await updateUserStakingData(twitterId, multisig, `${serviceId}`);

      setMultisig(multisig);
      onNextStep();
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
    const selectedContract = contract ? STAKING_CONTRACTS_DETAILS[contract] : null;
    return (
      <Flex vertical gap={8}>
        <Text type="secondary">
          Your staking contract:{' '}
          {isServiceInfoLoading && !selectedContract && <Skeleton.Input size="small" active />}
          {selectedContract && (
            <a href={`${GOVERN_APP_URL}/contracts/${contract}`} target="_blank">
              {selectedContract.name} ↗
            </a>
          )}
        </Text>
        <Text type="secondary">
          Your account address:{' '}
          <a href={`${base.blockExplorers.default.url}/address/${multisig}`} target="_blank">
            {truncateAddress(multisig)} ↗
          </a>
        </Text>
      </Flex>
    );
  }

  return (
    <>
      {!disabled && (
        <>
          <Radio.Group onChange={handleSelectContract} value={contract} className="mt-12 mb-12">
            <Space direction="vertical">
              {STAKING_CONTRACTS.map((item) => (
                <Radio value={item.id} key={item.id}>
                  <Text className="font-weight-600">{item.name}</Text>
                  <Text type="secondary">
                    {` | ${item.totalBond} OLAS stake | ${
                      item.pointsPerEpoch
                    } point${item.pointsPerEpoch > 1 ? 's' : ''} per epoch`}
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
        You will need to sign two transactions with your wallet to complete this step. Ensure you
        have OLAS and ETH for gas on Base Chain.
      </Paragraph>
      <Button
        type="primary"
        disabled={disabled || !contract}
        loading={isLoading}
        onClick={handleSetUpAndStake}
      >
        {isLoading ? 'Setting up staking' : 'Set up & stake'}
      </Button>
    </>
  );
};

const TweetAndEarn = ({ disabled }: { disabled: boolean }) => {
  const { address } = useAccount();

  return (
    <>
      <Paragraph type="secondary">
        Visit your user profile page and participate in X post campaigns. If you post enough for the
        epoch, you might be eligible to earn staking rewards.
      </Paragraph>
      <Paragraph type="secondary">
        First epoch activity reward is proportional to the time between contributor registration and
        the end of the on-going epoch.
      </Paragraph>
      <Link href={`/profile/${address}`} passHref>
        <Button type="primary" disabled={disabled}>
          Visit user profile
        </Button>
      </Link>
    </>
  );
};

export const StakingStepper = ({ profile }: { profile: XProfile | null }) => {
  const [step, setStep] = useState(
    profile?.twitter_id ? STAKING_STEPS.SET_UP_AND_STAKE : STAKING_STEPS.CONNECT_TWITTER,
  );

  const handleNext = () => setStep((prev) => prev + 1);

  useEffect(() => {
    // The leaderboard is re-fetched at intervals in the background.
    // Based on the data updated, we can navigate to next step
    if (profile?.service_multisig) {
      setStep(STAKING_STEPS.TWEET_AND_EARN);
    } else if (profile?.twitter_id) {
      setStep(STAKING_STEPS.SET_UP_AND_STAKE);
    }
  }, [profile]);

  return (
    <Flex>
      <Steps
        direction="vertical"
        size="small"
        current={step}
        items={[
          {
            title: <Text className="block mb-8">Connect X</Text>,
            description: <ConnectTwitter account={profile?.twitter_handle || null} />,
          },
          {
            title: (
              <Text className="block mb-8">
                Select staking contract, set up on-chain account and stake funds
              </Text>
            ),
            description: (
              <SetUpAndStake
                disabled={step !== STAKING_STEPS.SET_UP_AND_STAKE}
                twitterId={profile?.twitter_id || null}
                multisigAddress={profile?.service_multisig || null}
                onNextStep={handleNext}
              />
            ),
          },
          {
            title: <Text className="block mb-8">Post about Olas. Earn points. Earn rewards.</Text>,
            description: <TweetAndEarn disabled={step !== STAKING_STEPS.TWEET_AND_EARN} />,
          },
        ]}
      />
    </Flex>
  );
};
