import { useEffect, useState } from 'react';
import { fetchVotingPower } from 'components/MembersList/requests';
import { multicall } from '@wagmi/core';
import {
  VEOLAS_ABI,
  VEOLAS_ADDRESS_MAINNET,
} from 'common-util/AbiAndAddresses';
import { ethers } from 'ethers';
import {
  delegate,
  fetchDelegatee,
  fetchDelegatorList,
  fetchVeolasBalance,
} from './requests';
import { validateBeforeDelegate } from './utils';

/**
 * @param {string} account
 * @returns total voting power of the account, refetch data function
 */
export const useFetchVotingPower = (account) => {
  const [votingPower, setVotingPower] = useState();

  const getVotingPower = async () => {
    const result = await fetchVotingPower({ account });
    setVotingPower(result);
  };

  useEffect(() => {
    if (account) {
      getVotingPower();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return { votingPower, refetchVotingPrower: getVotingPower };
};

/**
 * @param {string} account
 * @returns
 * account's veOlas balance,
 * total delegated balance to the account,
 * list of delegators addresses
 *
 */
export const useVotingPowerBreakdown = (account) => {
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

  const getDelegatedToYou = async () => {
    try {
      const response = await multicall({
        contracts: delegatorList.map((address) => ({
          address: VEOLAS_ADDRESS_MAINNET,
          abi: VEOLAS_ABI,
          functionName: 'getVotes',
          args: [address],
        })),
      });

      let total = 0n;

      // Calculate total balance delegated to the account
      for (let i = 0; i < response.length; i += 1) {
        const bigIntValue = ethers.toBigInt(response[i].result);
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
export const useFetchDelegatee = (account) => {
  const [delegatee, setDelegatee] = useState(null);

  const getDelegatee = async () => {
    try {
      const result = await fetchDelegatee({ account });
      if (result !== ethers.ZeroAddress) {
        setDelegatee(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDelegatee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

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
export const useDelegate = (account, delegatee, balance) => {
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
export const useUndelegate = (account, delegatee, balance) => {
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
