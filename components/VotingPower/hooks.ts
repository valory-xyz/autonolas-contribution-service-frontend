import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import {
  DELEGATE_CONTRIBUTE_ABI, // delegateContribute
  DELEGATE_CONTRIBUTE_ADDRESS_MAINNET,
  VEOLAS_ABI, // veOlas
  VEOLAS_ADDRESS_MAINNET,
} from 'common-util/AbiAndAddresses';

import { delegate, fetchDelegatorList, fetchVeolasBalance } from './requests';
import { validateBeforeDelegate } from './utils';

type OnErrorType = (error: unknown | Error) => void;

/**
 * @param {string} account
 * @returns total voting power of the account, refetch data function
 */
export const useFetchVotingPower = (account: Address) => {
  const { data, refetch } = useReadContract({
    address: DELEGATE_CONTRIBUTE_ADDRESS_MAINNET,
    abi: DELEGATE_CONTRIBUTE_ABI,
    functionName: 'votingPower',
    chainId: mainnet.id,
    args: [account],
    query: {
      enabled: !!account,
    },
  });

  return { votingPower: data, refetchVotingPower: refetch };
};

/**
 * @param {string} account
 * @returns
 * account's veOlas balance,
 * total delegated balance to the account,
 * list of delegators addresses
 *
 */
export const useVotingPowerBreakdown = (account: string) => {
  const [delegatorList, setDelegatorList] = useState<Address[]>([]);
  const [balance, setBalance] = useState<string>('0');
  const [delegatorsBalance, setDelegatorsBalance] = useState<string>('0');

  const getDelegatorList = async () => {
    try {
      const list = await fetchDelegatorList({ account });
      setDelegatorList(list);
    } catch (error) {
      console.error(error);
    }
  };

  const getBalance = async () => {
    try {
      const result = await fetchVeolasBalance({ account });
      setBalance(result);
    } catch (error) {
      console.error(error);
    }
  };

  const contracts = delegatorList.map((delegator) => ({
    address: VEOLAS_ADDRESS_MAINNET as Address,
    abi: VEOLAS_ABI,
    functionName: 'getVotes',
    args: [delegator],
  }));

  const { data } = useReadContracts({
    contracts,
    query: {
      enabled: delegatorList.length > 0,
      select: (data) => {
        let total = BigInt(0);

        data.forEach((item) => {
          if (item.status === 'success') {
            if (item.result !== null && item.result !== undefined) {
              const bigIntValue = BigInt(item.result.toString());
              total += bigIntValue;
            }
          }
        });

        return total.toString();
      },
    },
  });

  useEffect(() => {
    getDelegatorList();
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    if (delegatorList.length > 0 && data) {
      setDelegatorsBalance(data);
    }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, delegatorList]);

  return { balance, delegatorsBalance, delegatorList };
};

/**
 * @param {string} account
 * @returns address to which the account has delegated
 */
export const useFetchDelegatee = (account: Address) => {
  const { data, refetch } = useReadContract({
    address: DELEGATE_CONTRIBUTE_ADDRESS_MAINNET,
    abi: DELEGATE_CONTRIBUTE_ABI,
    functionName: 'mapDelegation',
    chainId: mainnet.id,
    args: [account],
    query: {
      enabled: !!account,
    },
  });

  const delegatee = data !== ethers.ZeroAddress ? data : null;

  return { delegatee, setDelegatee: refetch };
};

/**
 * used for delegating from account to delegatee,
 * runs validations before delegation
 * @param {string} account
 * @param {string} balance
 * @param {string} delegatee
 * @returns pending status, delegate handler
 */
export const useDelegate = (account: string, balance: string, delegatee: string) => {
  const [isSending, setIsSending] = useState(false);

  const handleDelegate = async ({
    values,
    onSuccess,
    onError,
  }: {
    values: { address: Address };
    onSuccess: (address: Address) => void;
    onError: OnErrorType;
  }) => {
    setIsSending(true);

    try {
      const { address } = values;

      await validateBeforeDelegate({
        account,
        balance,
        delegatee,
        newDelegatee: address,
      });

      await delegate({ account, delegatee: address });

      onSuccess(address);
    } catch (error) {
      onError(error);
    } finally {
      setIsSending(false);
    }
  };

  return { isDelegating: isSending, handleDelegate };
};

/**
 * used for undelegating from account to Zero address,
 * runs validations before undelegation
 * @param {string} account
 * @param {string} delegatee
 * @param {string} balance
 * @returns pending status, undelegate handler
 */
export const useUndelegate = (account: string, delegatee: string, balance: string) => {
  const [isSending, setIsSending] = useState(false);

  const handleUndelegate = async ({
    onSuccess,
    onError,
  }: {
    onSuccess: () => void;
    onError: OnErrorType;
  }) => {
    setIsSending(true);

    try {
      await validateBeforeDelegate({
        account,
        balance,
        delegatee,
        newDelegatee: ethers.ZeroAddress,
      });
      await delegate({ account, delegatee: ethers.ZeroAddress });

      onSuccess();
    } catch (error) {
      onError(error);
    } finally {
      setIsSending(false);
    }
  };

  return {
    canUndelegate: !!delegatee,
    isUndelegating: isSending,
    handleUndelegate,
  };
};
