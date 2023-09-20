import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ServiceStatusInfo } from '@autonolas/frontend-library';

import { getLeaderboardList, getLatestMintedNft } from 'common-util/api';
import {
  setLeaderboard,
  setNftDetails,
  setHealthcheck,
} from 'store/setup/actions';
import { getHealthcheck } from './utils';

const ServiceStatus = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const healthDetails = useSelector((state) => state?.setup?.healthcheck);
  const isHealthy = !!healthDetails?.is_transitioning_fast;

  // fetch healthcheck on first render
  useEffect(() => {
    getHealthcheck()
      .then((response) => {
        dispatch(setHealthcheck(response));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // poll healthcheck every 1 minute
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await getHealthcheck();
        dispatch(setHealthcheck(response));

        // fetch leaderboard list
        const list = await getLeaderboardList();
        dispatch(setLeaderboard(list));

        // update badge if the user is logged-in
        if (account) {
          const { details, tokenId } = await getLatestMintedNft(account);
          dispatch(setNftDetails({ tokenId, ...(details || {}) }));
        }
      } catch (error) {
        window.console.warn('Error on fetching healthcheck');
        window.console.error(error);
        dispatch(setHealthcheck(null));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ServiceStatusInfo
      isHealthy={isHealthy}
      appType="iekit"
      isDefaultMaximized
    />
  );
};

export default ServiceStatus;
