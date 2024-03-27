import { useEffect, useState } from 'react';
import { fetchVotingPower } from 'components/MembersList/requests';
import { ZERO_ADDRESS } from 'util/constants';
import { delegate, fetchDelegatee, fetchDelegatorList } from './requests';
import { validateBeforeDelegate } from './utils';

export const useFetchVotingPower = (account) => {
  const [balance, setBalance] = useState();

  const getVotingPower = async () => {
    const votingPower = await fetchVotingPower({ account });
    setBalance(votingPower);
  };

  useEffect(() => {
    if (account) {
      getVotingPower();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return { balance };
};

export const useFetchDelegatorList = (account) => {
  const [delegatorList, setDelegatorList] = useState([]);

  const getDelegatorList = async () => {
    try {
      const list = await fetchDelegatorList({ account });
      setDelegatorList(list);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDelegatorList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return { delegatorList };
};

export const useFetchDelegatee = (account) => {
  const [delegatee, setDelegatee] = useState(null);

  const getDelegatee = async () => {
    try {
      const result = await fetchDelegatee({ account });
      if (result !== ZERO_ADDRESS) {
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

export const useDelegate = (account, delegatee) => {
  const [isSending, setIsSending] = useState(false);

  const handleDelegate = async ({ values, onSuccess, onError }) => {
    setIsSending(true);

    try {
      const { address } = values;

      await validateBeforeDelegate({
        account,
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

export const useUndelegate = (account, delegatee) => {
  const [isSending, setIsSending] = useState(false);

  const handleUndelegate = async ({ onSuccess, onError }) => {
    setIsSending(true);

    try {
      await validateBeforeDelegate({
        account,
        delegatee,
        newDelegatee: ZERO_ADDRESS,
      });

      await delegate({ account, delegatee: ZERO_ADDRESS });

      onSuccess();
    } catch (error) {
      onError(error);
    } finally {
      setIsSending(false);
    }
  };

  return { canUndelegate: !!delegatee, isUndelegating: isSending, handleUndelegate };
};
