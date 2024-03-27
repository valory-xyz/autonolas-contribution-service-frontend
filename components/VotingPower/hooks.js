import { useEffect, useState } from 'react';
import { fetchVotingPower } from 'components/MembersList/requests';
import { ZERO_ADDRESS } from 'util/constants';
import { fetchDelegatee, fetchDelegatorList } from './requests';

export const useVeolasBalance = (account) => {
  const [balance, setBalance] = useState();

  const getBalance = async () => {
    const veolasBalance = await fetchVotingPower({ account });
    setBalance(veolasBalance);
  };

  useEffect(() => {
    if (account) {
      getBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return { balance };
};

export const useDelegatorList = (account) => {
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

export const useDelegatee = (account) => {
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
