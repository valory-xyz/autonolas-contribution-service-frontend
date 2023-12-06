import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOrbisConnection } from 'store/setup/actions';
import {
  getProvider, notifyError, notifySuccess,
} from '@autonolas/frontend-library';
import orbis from 'common-util/orbis';
import { notification } from 'antd';
import { useNetwork } from 'wagmi';
import { SUPPORTED_CHAINS } from 'common-util/Login';
import { RPC_URLS } from 'common-util/Contracts';

const useOrbis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const account = useSelector((state) => state?.setup?.account);
  const dispatch = useDispatch();
  const { chain } = useNetwork();

  const connect = async () => {
    setIsLoading(true);

    if (!account) {
      notification.error({
        message: 'Couldn\'t sign in to Orbis. Make sure your wallet is connected.',
        placement: 'topLeft',
        style: {
          width: 600,
        },
      });
      console.error('Error signing into Orbis: no account found');
      setIsLoading(false);
      return null;
    }

    if (chain.id !== 1) {
      notification.error({
        message: 'Couldn\'t sign in. Connect to Ethereum Mainnet to sign in to Orbis.',
        placement: 'topLeft',
      });
      setIsLoading(false);
      return null;
    }

    const provider = getProvider(SUPPORTED_CHAINS, RPC_URLS);

    const response = await orbis.connect_v2({
      provider,
      chain: 'ethereum',
    });

    if (response.status === 200) {
      notification.success({
        message: 'Signed in to Orbis',
        placement: 'topLeft',
      });
      dispatch(setOrbisConnection(true));
    } else {
      console.error('Couldn\'t sign into Orbis', response);
    }
    setIsLoading(false);
    return response.status === 200 ? response.did : null;
  };

  const disconnect = async () => {
    setIsLoading(true);

    const res = await orbis.logout();

    if (res.status !== 200) {
      notifyError('Couldn\'t logout from Orbis');
    }

    notifySuccess('Signed out of Orbis');
    setIsLoading(false);
    dispatch(setOrbisConnection(false));
    return res.status === 200 ? res : null;
  };

  return { connect, disconnect, isLoading };
};

export default useOrbis;
