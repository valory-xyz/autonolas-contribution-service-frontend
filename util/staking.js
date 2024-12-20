import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { isNil, isNumber } from 'lodash';
import { useMemo } from 'react';
import { useReadContract } from 'wagmi';
import { base } from 'wagmi/chains';

import { areAddressesEqual } from '@autonolas/frontend-library';

import {
  CONTRIBUTORS_ABI,
  CONTRIBUTORS_ADDRESS_BASE,
  STAKING_TOKEN_ABI,
} from 'common-util/AbiAndAddresses';
import { formatToEth } from 'common-util/functions';
import { formatTimeDifference } from 'common-util/functions/time';
import { SERVICE_STAKING_STATE, STAKING_CONTRACTS_BASE_SUBGRAPH_URL } from 'util/constants';

export const useAccountServiceInfo = (account) => {
  const { data, isLoading } = useReadContract({
    address: CONTRIBUTORS_ADDRESS_BASE,
    abi: CONTRIBUTORS_ABI,
    chainId: base.id,
    functionName: 'mapAccountServiceInfo',
    args: [account],
    query: {
      enabled: !!account,
      select: (data) => {
        const [socialId, serviceId, multisig, stakingInstance] = data;
        return { socialId, serviceId, multisig, stakingInstance };
      },
    },
  });

  return { data, isLoading };
};

export const useReadStakingContract = (functionName, address, chainId, args, enabled = true) =>
  useReadContract({
    address,
    abi: STAKING_TOKEN_ABI,
    chainId,
    functionName,
    args,
    query: {
      enabled: !!address && enabled,
    },
  });

const checkpointQuery = gql`
  {
    checkpoints(orderBy: epoch, orderDirection: desc) {
      id
      epoch
      contractAddress
      rewards
      blockTimestamp
      serviceIds
    }
  }
`;

export const useStakingDetails = (serviceId, stakingInstance) => {
  const { data, isLoading } = useQuery({
    queryKey: ['checkpoints', serviceId],
    enabled: !!serviceId,
    queryFn: async () => await request(STAKING_CONTRACTS_BASE_SUBGRAPH_URL, checkpointQuery),
  });

  const { data: livenessPeriod, isLoading: isLivenessPeriodLoading } = useReadStakingContract(
    'livenessPeriod',
    stakingInstance,
    base.id,
  );
  const { data: rewardsPerSecond, isLoading: isRewardsPerSecondLoading } = useReadStakingContract(
    'rewardsPerSecond',
    stakingInstance,
    base.id,
  );
  const { data: minStakingDuration, isLoading: isMinStakingDurationLoading } =
    useReadStakingContract('minStakingDuration', stakingInstance, base.id);
  const { data: stakingState, isLoading: isStakingStateLoading } = useReadStakingContract(
    'getStakingState',
    stakingInstance,
    base.id,
    [serviceId],
    !!serviceId,
  );
  const { data: serviceInfo, isLoading: isServiceInfoLoading } = useReadStakingContract(
    'getServiceInfo',
    stakingInstance,
    base.id,
    [serviceId],
    !!serviceId,
  );

  const totalRewards = useMemo(() => {
    if (!data) return 0;
    if ((data.checkpoints || []).length === 0) return 0;

    // get rewards from all checkpoints where the provided service was registered
    const totalRewardsInWei = data.checkpoints.reduce((sum, checkpoint) => {
      const serviceIndex = checkpoint.serviceIds.findIndex((item) => item === serviceId);
      if (serviceIndex !== -1) {
        sum += BigInt(checkpoint.rewards[serviceIndex]);
      }
      return sum;
    }, BigInt(0));

    return formatToEth(totalRewardsInWei.toString());
  }, [data, serviceId]);

  // Epoch's end, counter and rewards
  const epochDetails = useMemo(() => {
    if (!data) return null;
    if ((data.checkpoints || []).length === 0) return null;
    if (!livenessPeriod) return null;
    if (!rewardsPerSecond) return null;

    const lastEpoch = data.checkpoints.find((item) =>
      areAddressesEqual(item.contractAddress, stakingInstance),
    );
    if (!lastEpoch) return null;
    return {
      epochEndTimestamp: Number(lastEpoch.blockTimestamp) + Number(livenessPeriod),
      epochCounter: Number(lastEpoch.epoch),
      rewardsPerEpoch: formatToEth((livenessPeriod * rewardsPerSecond).toString()),
    };
  }, [data, stakingInstance, livenessPeriod, rewardsPerSecond]);

  // Staking status: Unstaked, Staked or Evicted
  const stakingStatus = isNumber(stakingState)
    ? SERVICE_STAKING_STATE[stakingState]
    : SERVICE_STAKING_STATE[0];

  // Eviction expire timestamp
  const evictionExpiresTimestamp =
    Number(serviceInfo?.tsStart ?? 0) + Number(minStakingDuration ?? 0);

  const isServiceStakedForMinimumDuration =
    !isNil(serviceInfo?.tsStart) &&
    !isNil(minStakingDuration) &&
    evictionExpiresTimestamp <= Math.round(Date.now() / 1000);

  // TODO: add check if the contract has enough rewards and slots
  const isEligibleForStaking =
    stakingStatus === 'Evicted' ? isServiceStakedForMinimumDuration : true;

  return {
    data: {
      totalRewards,
      rewardsPerEpoch: epochDetails?.rewardsPerEpoch ?? null,
      epochEndTimestamp: epochDetails?.epochEndTimestamp ?? null,
      epochCounter: epochDetails?.epochCounter ?? null,
      epochLength: livenessPeriod ? formatTimeDifference(Number(livenessPeriod) * 1000) : null,
      stakingStatus,
      isEligibleForStaking,
      evictionExpiresTimestamp,
    },
    isLoading:
      isLoading ||
      isLivenessPeriodLoading ||
      isRewardsPerSecondLoading ||
      isMinStakingDurationLoading ||
      isStakingStateLoading ||
      isServiceInfoLoading,
  };
};
