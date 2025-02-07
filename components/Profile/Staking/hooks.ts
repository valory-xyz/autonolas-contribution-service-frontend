import { message } from 'antd';
import { useCallback, useState } from 'react';
import { Address } from 'viem';
import { base, mainnet } from 'viem/chains';
import { useAccount, useSwitchChain } from 'wagmi';

import { notifyError, notifyWarning } from '@autonolas/frontend-library';

import { DEPRECATED_CONTRACTS_ADDRESSES } from 'util/constants';

import { restake } from './requests';

type UseRestakeParams = {
  contractAddress: Address | undefined;
};

export const useRestake = ({ contractAddress }: UseRestakeParams) => {
  const { chainId, address: account } = useAccount();
  const { switchChainAsync, switchChain } = useSwitchChain();
  const [isRestaking, setIsRestaking] = useState(false);

  const handleRestake = useCallback(async () => {
    if (!account) return;
    if (!contractAddress) return;

    if (DEPRECATED_CONTRACTS_ADDRESSES.includes(contractAddress)) {
      notifyWarning(
        'Restaking is no longer supported by this contract. Please follow the instructions to unstake and stake in a new contract.',
      );
      return;
    }

    setIsRestaking(true);

    try {
      // Switch to base
      if (chainId !== base.id) {
        await switchChainAsync({ chainId: base.id });
      }

      // Call restake
      await restake({ contractAddress, account });
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
  }, [account, chainId, contractAddress, switchChain, switchChainAsync]);

  return { isRestaking, handleRestake };
};
