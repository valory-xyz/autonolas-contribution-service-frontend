import { multicall } from '@wagmi/core';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import {
  DELEGATE_CONTRIBUTE_ABI, // delegateContribute
  DELEGATE_CONTRIBUTE_ADDRESS_MAINNET,
  VEOLAS_ABI, // veOlas
  VEOLAS_ADDRESS_MAINNET,
} from 'common-util/AbiAndAddresses';
import { wagmiConfig } from 'common-util/Login/config';
import { fetchVotingPower } from 'components/MembersList/requests';

import { delegate, fetchDelegatee, fetchDelegatorList, fetchVeolasBalance } from './requests';
import { validateBeforeDelegate } from './utils';

/**
 * @param {string} account
 * @returns total voting power of the account, refetch data function
 */
export const useFetchVotingPower = (account: Address) => {
  // const [votingPower, setVotingPower] = useState();
  // const getVotingPower = async () => {
  //   const result = await fetchVotingPower({ account });
  //   setVotingPower(result);
  // };
  // useEffect(() => {
  //   if (account) {
  //     getVotingPower();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [account]);
  // return { votingPower, refetchVotingPower: getVotingPower };

  const { data, isFetching, refetch } = useReadContract({
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
  const [delegatorList, setDelegatorList] = useState([]);
  const [balance, setBalance] = useState();
  const [delegatorsBalance, setDelegatorsBalance] = useState('0');

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

  // TODO: to wagmi (example from apps\operate\components\Contracts\hooks\useContractDetails)
  const getDelegatedToYou = async () => {
    try {
      const response = await multicall(wagmiConfig, {
        contracts: delegatorList.map((address) => ({
          address: VEOLAS_ADDRESS_MAINNET,
          abi: VEOLAS_ABI,
          functionName: 'getVotes',
          args: [address],
        })) as any,
      });

      let total = BigInt(0);

      // Calculate total balance delegated to the account
      for (let i = 0; i < response.length; i += 1) {
        const bigIntValue = ethers.toBigInt(response[i].result as any);
        total += bigIntValue;
      }

      setDelegatorsBalance(total.toString());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDelegatorList();
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    if (delegatorList.length > 0) {
      getDelegatedToYou();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delegatorList]);

  return { balance, delegatorsBalance, delegatorList };
};

/**
 * @param {string} account
 * @returns address to which the account has delegated
 */
export const useFetchDelegatee = (account: string) => {
  const [delegatee, setDelegatee] = useState(null);

  const getDelegatee = useCallback(async () => {
    try {
      const result = await fetchDelegatee({ account });
      if (result !== ethers.ZeroAddress) {
        setDelegatee(result);
      }
    } catch (error) {
      console.error(error);
    }
  }, [account]);

  useEffect(() => {
    getDelegatee();
  }, [getDelegatee]);

  return { delegatee, setDelegatee };
};

/**
 * used for delegating from account to delegatee,
 * runs validations before delegation
 * @param {string} account
 * @param {string} delegatee
 * @param {string} balance
 * @returns pending status, delegate handler
 */
export const useDelegate = (account: string, delegatee: string, balance: string) => {
  const [isSending, setIsSending] = useState(false);

  const handleDelegate = async ({ values, onSuccess, onError }) => {
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

  const handleUndelegate = async ({ onSuccess, onError }) => {
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
