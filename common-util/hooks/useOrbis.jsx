import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOrbisConnection } from 'store/setup/actions';
import { notifyError } from '@autonolas/frontend-library';
import orbis from 'common-util/orbis';
import { notification } from 'antd';

const useOrbis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const account = useSelector((state) => state?.setup?.account);
  const dispatch = useDispatch();

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

    const response = await orbis.connect_v2({
      provider: window.ethereum,
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

    notification.success({
      message: 'Signed out of Orbis',
      placement: 'topLeft',
    });
    setIsLoading(false);
    await dispatch(setOrbisConnection(false));
    return res.status === 200 ? res : null;
  };

  return { connect, disconnect, isLoading };
};

export default useOrbis;
