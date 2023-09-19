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

  return (
    <ServiceStatusInfo
      isHealthy={isHealthy}
      appType="iekit"
      onTimerFinish={async () => {
        // once the timer is completed, fetch the health checkup again
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
          window.console.log('Error after timer completion');
          window.console.error(error);
        }
      }}
    />
  );
};

export default ServiceStatus;
