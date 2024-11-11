import { base } from 'wagmi/chains';
import { useReadContract } from 'wagmi';
import {
  CONTRIBUTORS_ABI,
  CONTRIBUTORS_ADDRESS_BASE,
} from 'common-util/AbiAndAddresses';

export const useAccountServiceInfo = ({ account }) =>  {
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