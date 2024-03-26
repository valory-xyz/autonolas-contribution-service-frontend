import { useEffect, useState } from 'react';
import { fetchVeolasBalance } from 'components/MembersList/requests';
import { fetchDelegatorList } from './requests';

export const useVeolasBalance = (account) => {
  const [balance, setBalance] = useState();

  const getBalance = async () => {
    const veolasBalance = await fetchVeolasBalance({ account });
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
