import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ServiceStatusInfo } from '@autonolas/frontend-library';

import {
  setLeaderboard,
  setNftDetails,
  setHealthcheck,
} from 'store/setup/actions';
import { getLeaderboardList, getLatestMintedNft } from 'common-util/api';
import { notifyError } from 'common-util/functions';
import { getHealthcheck } from './utils';

const MINUTE = 60 * 1000;

const ServiceStatus = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const healthDetails = useSelector((state) => state?.setup?.healthcheck);
  const isHealthy = !!healthDetails?.is_transitioning_fast;

  // fetch healthcheck on first render
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getHealthcheck();
        dispatch(setHealthcheck(response));
      } catch (error) {
        notifyError('Error on fetching healthcheck');
        console.error(error);
      }
    };

    getData();
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
        notifyError('Error on fetching healthcheck');
        dispatch(setHealthcheck(null));
        console.error(error);
      }
    }, MINUTE);

    return () => clearInterval(interval);
  }, []);

  return <ServiceStatusInfo isHealthy={isHealthy} appType="iekit" />;
};

export default ServiceStatus;
