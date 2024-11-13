import { useMemo } from 'react';
import { base } from 'wagmi/chains';
import { useReadContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { areAddressesEqual } from '@autonolas/frontend-library';
import {
  CONTRIBUTORS_ABI,
  CONTRIBUTORS_ADDRESS_BASE,
  STAKING_TOKEN_ABI,
} from 'common-util/AbiAndAddresses';
import { formatToEth } from 'common-util/functions';
import  {STAKING_CONTRACTS_BASE_SUBGRAPH_URL } from 'util/constants';

export const useAccountServiceInfo = (account) =>  {
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
        return { socialId, serviceId, multisig, stakingInstance }
      }
    },
  })

  return { data, isLoading };
}

export const useStakingDetails = (serviceId, stakingInstance) =>  {
  const { data, isLoading } = useQuery({
    queryKey: ['checkpoints'],
    enabled: !!serviceId,
    queryFn: async () => await request(STAKING_CONTRACTS_BASE_SUBGRAPH_URL, gql`
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
    `),
  });

  const { data: livenessPeriod, isLoading: isLivenessPeriodLoading } = useReadContract({
    address: stakingInstance,
    abi: STAKING_TOKEN_ABI,
    chainId: base.id,
    functionName: 'livenessPeriod',
    query: {
      enabled: !!stakingInstance,
    },
  })

  const { data: rewardsPerSecond, isLoading: isRewardsPerSecondLoading } = useReadContract({
    address: stakingInstance,
    abi: STAKING_TOKEN_ABI,
    chainId: base.id,
    functionName: 'rewardsPerSecond',
    query: {
      enabled: !!stakingInstance,
    },
  })

  const totalRewards = useMemo(() => {
    if (!data) return 0;
    if ((data.checkpoints || []).length === 0) return 0;

    // get rewards from all checkpoints where the provided service was registered
    const totalRewardsInWei = data.checkpoints.reduce((sum, checkpoint) => {
      const serviceIndex = checkpoint.serviceIds.findIndex(item => item === serviceId);
      if (serviceIndex !== -1) {
        sum += BigInt(checkpoint.rewards[serviceIndex])
      }
      return sum;
    }, BigInt(0));

    return formatToEth(totalRewardsInWei.toString())
  }, [data, serviceId])

  const epochData = useMemo(() => {
    if (!data) return null;
    if ((data.checkpoints || []).length === 0) return null;
    if (!livenessPeriod) return null;
    if (!rewardsPerSecond) return null

    const lastEpoch = data.checkpoints.find(item => areAddressesEqual(item.contractAddress, stakingInstance));
    if (lastEpoch) {
      return {
        epochEndTimestamp: Number(lastEpoch.blockTimestamp) + Number(livenessPeriod),
        epochCounter: Number(lastEpoch.epoch),
        rewardsPerEpoch: formatToEth((livenessPeriod * rewardsPerSecond).toString())
      }
    }
    return null;
  }, [data, stakingInstance, livenessPeriod, rewardsPerSecond])

  return {
    data: {
      totalRewards,
      rewardsPerEpoch: epochData?.rewardsPerEpoch || null,
      epochEndTimestamp: epochData?.epochEndTimestamp || null,
      epochCounter: epochData?.epochCounter || null,
    },
    isLoading: isLoading || isLivenessPeriodLoading || isRewardsPerSecondLoading,
  };
}