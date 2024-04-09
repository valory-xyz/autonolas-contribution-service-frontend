import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProvider,
  notifyError,
  notifySuccess,
} from '@autonolas/frontend-library';
import { useAccount } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import { RPC_URLS } from 'common-util/Contracts';
import orbis, { ORBIS_SUPPORTED_CHAIN, checkOrbisNegativeStatus, checkOrbisStatus } from 'common-util/orbis';
import { setOrbisConnection } from 'store/setup';

// Messages object for success and error notifications
const messages = {
  signInError: "Couldn't sign in to Orbis. Make sure your wallet is connected.",
  signInSuccess: 'Signed in to Orbis',
  signOutError: "Couldn't logout from Orbis",
  signOutSuccess: 'Signed out of Orbis',
  updateUsernameError: "Couldn't update username",
  updateUsernameSuccess: 'Username updated',
  connectMainnetError: "Couldn't sign in. Connect to Ethereum Mainnet to sign in to Orbis.",
  getProfileError: "Couldn't get profile",
  noAccountError: 'Error signing into Orbis: no account found',
  addressRequiredError: 'Address is required to get the profile.',
  usernameRequiredError: 'Username is required to update the profile.',
};

const useOrbis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const account = useSelector((state) => state?.setup?.account);
  const connection = useSelector((state) => state.setup.connection);
  const { chain } = useAccount();
  const dispatch = useDispatch();

  // Helper function to manage loading state
  const setLoadingState = (state) => {
    setIsLoading(state);
  };

  const updateOrbisConnectionState = useCallback(async (updatedConnection) => {
    setLoadingState(true);
    const res = await orbis.isConnected();

    if (checkOrbisStatus(res?.status)) {
      const positiveConnection = updatedConnection || res;
      dispatch(setOrbisConnection(positiveConnection));
      setLoadingState(false);
      return positiveConnection;
    }

    const negativeConnection = null;
    dispatch(setOrbisConnection(negativeConnection));
    setLoadingState(false);
    return null;
  }, [dispatch]);

  const connect = useCallback(async () => {
    setLoadingState(true);

    // Error out if no account is found
    if (!account) {
      notifyError(messages.signInError);
      console.error(messages.noAccountError);
      setLoadingState(false);
      return null;
    }

    // Error out if not on Ethereum Mainnet
    if (chain.id !== ORBIS_SUPPORTED_CHAIN) {
      notifyError(messages.connectMainnetError);
      setLoadingState(false);
      return null;
    }

    const provider = getProvider([mainnet], RPC_URLS);

    const newConnection = await orbis.connect_v2({
      provider,
      chain: 'ethereum',
    });

    if (checkOrbisStatus(newConnection?.status)) {
      notifySuccess(messages.signInSuccess);
      dispatch(setOrbisConnection(newConnection));
    } else {
      console.error(messages.signInError, newConnection);
    }
    setLoadingState(false);
    return checkOrbisStatus(newConnection?.status) ? newConnection : null;
  }, [account, chain, dispatch]);

  const isOrbisConnected = checkOrbisStatus(connection?.status);

  const disconnect = useCallback(async () => {
    setLoadingState(true);

    const res = orbis.logout();

    if (checkOrbisNegativeStatus(res?.status)) {
      notifyError(messages.signOutError);
    } else {
      notifySuccess(messages.signOutSuccess);
    }
    setLoadingState(false);
    dispatch(setOrbisConnection(null));
    return checkOrbisStatus(res?.status) ? res : null;
  }, [dispatch]);

  const getProfile = useCallback(async (address) => {
    setLoadingState(true);

    if (!address) {
      console.error(messages.addressRequiredError);
      setLoadingState(false);
      return null;
    }

    const did = `did:pkh:eip155:1:${address.toLowerCase()}`;

    const res = await orbis.getProfile(did);

    if (checkOrbisStatus(res?.status)) {
      setLoadingState(false);
      return res;
    }

    console.error(messages.getProfileError);
    setLoadingState(false);
    return null;
  }, []);

  const profile = connection?.details?.profile || null;
  const address = connection?.details?.metadata?.address || null;

  const updateUsername = useCallback(async (username) => {
    setLoadingState(true);

    if (!username) {
      console.error(messages.usernameRequiredError);
      setLoadingState(false);
      return null;
    }

    const res = await orbis.updateProfile({ username });

    if (checkOrbisStatus(res?.status)) {
      const updatedConnection = {
        ...connection,
        details: { ...connection.details, profile: { username } },
      };
      await updateOrbisConnectionState(updatedConnection);
      notifySuccess(messages.updateUsernameSuccess);
    } else {
      notifyError(messages.updateUsernameError);
      console.error('Error updating username:', res);
    }
    setLoadingState(false);
    return res;
  }, [connection, updateOrbisConnectionState]);

  return {
    connect,
    disconnect,
    isLoading,
    isOrbisConnected,
    updateOrbisConnectionState,
    profile,
    address,
    updateUsername,
    getProfile,
  };
};

export default useOrbis;
