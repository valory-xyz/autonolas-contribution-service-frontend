import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ServiceStatusInfo } from '@autonolas/frontend-library';

import {
  setIsLeaderboardLoading,
  setLeaderboard,
  setNftDetails,
} from 'store/setup/actions';
import { getLeaderboardList, getLatestMintedNft } from 'common-util/api';
import { useHealthCheckup } from 'common-util/hooks/useHealthCheckup';
import { useHelpers } from 'common-util/hooks/useHelpers';

const MINUTE = 60 * 1000;

const ServiceStatus = () => {
  const dispatch = useDispatch();
  const { account, chainId } = useHelpers();

  // load leaderboard list only once on page load
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        dispatch(setIsLeaderboardLoading(true));
        const list = await getLeaderboardList();
        dispatch(setLeaderboard(list));
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setIsLeaderboardLoading(false));
      }
    };

    fetchLeaderboard();
  }, [chainId]);

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

  const [isHealthy] = useHealthCheckup(
    `${process.env.NEXT_PUBLIC_PFP_URL}/healthcheck`,
    MINUTE,
    pollingCallback,
  );

  return <ServiceStatusInfo isHealthy={isHealthy} appType="iekit" />;
};

export default ServiceStatus;
