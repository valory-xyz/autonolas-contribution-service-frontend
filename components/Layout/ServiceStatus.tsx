import { useDispatch } from 'react-redux';

import { ServiceStatusInfo } from '@autonolas/frontend-library';

import { getLeaderboardList } from 'common-util/api';
import { useHealthCheckup } from 'common-util/hooks/useHealthCheckup';
import { setLeaderboard } from 'store/setup';

const MINUTE = 60 * 1000;

export const ServiceStatus = () => {
  const dispatch = useDispatch();
  // const { account } = useHelpers();

  const pollingCallback = async () => {
    // fetch leaderboard list
    const list = await getLeaderboardList();
    dispatch(setLeaderboard(list));

    // NOTE: leaderboard is now the default page thus no need to poll minted nft
    //
    // update badge if the user is logged-in
    // if (account) {
    //   const { details, tokenId } = await getLatestMintedNft(account);
    //   dispatch(setNftDetails({ tokenId, ...(details || {}) }));
    // }
  };

  const [isHealthy] = useHealthCheckup(
    `${process.env.NEXT_PUBLIC_PFP_URL}/healthcheck`,
    MINUTE,
    pollingCallback,
  );

  return <ServiceStatusInfo isHealthy={isHealthy} appType="iekit" />;
};
