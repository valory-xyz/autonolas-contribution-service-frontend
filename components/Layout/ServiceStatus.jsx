import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ServiceStatusInfo } from '@autonolas/frontend-library';

import {
  setLeaderboard,
  setNftDetails,
  setHealthcheck,
} from 'store/setup/actions';
import { getLeaderboardList, getLatestMintedNft } from 'common-util/api';
import { useApiPolling } from 'common-util/api/useHealthCheckup';

const MINUTE = 60 * 1000;

const ServiceStatus = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);

  const pollingCallback = async () => {
    // fetch leaderboard list
    const list = await getLeaderboardList();
    dispatch(setLeaderboard(list));

    // update badge if the user is logged-in
    if (account) {
      const { details, tokenId } = await getLatestMintedNft(account);
      dispatch(setNftDetails({ tokenId, ...(details || {}) }));
    }
  };

  const { isHealthy, data } = useApiPolling(
    `${process.env.NEXT_PUBLIC_PFP_URL}/healthcheck`,
    MINUTE,
    pollingCallback,
  );

  useEffect(() => {
    if (data) {
      dispatch(setHealthcheck(data));
    }
  }, [data]);

  return <ServiceStatusInfo isHealthy={isHealthy} appType="iekit" />;
};

export default ServiceStatus;
