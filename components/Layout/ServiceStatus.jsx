import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ServiceStatusInfo,
} from '@autonolas/frontend-library';

import { getLeaderboardList, getLatestMintedNft } from 'common-util/api';
import {
  setLeaderboard,
  setNftDetails,
  setHealthcheck,
} from 'store/setup/actions';
import { getHealthcheck } from './utils';

const Footer = () => {
  // selectors & dispatch
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const healthDetails = useSelector((state) => state?.setup?.healthcheck);
  const isHealthy = !!healthDetails?.healthy;

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
        // update the timer in redux
        dispatch(
          setHealthcheck({
            ...(healthDetails || {}),
            seconds_until_next_update: null,
          }),
        );

        // once the timer is completed, fetch the health checkup again
        getHealthcheck()
          .then(async (response) => {
            const timer = response.seconds_until_next_update;
            const tenPercentExtra = 0.1 * timer; // 10% extra to be added
            dispatch(
              setHealthcheck({
                ...response,
                seconds_until_next_update: timer + tenPercentExtra,
              }),
            );

            // update leaderboard
            const list = await getLeaderboardList();
            dispatch(setLeaderboard(list));

            // update badge if the user is logged-in
            if (account) {
              const { details, tokenId } = await getLatestMintedNft(account);
              dispatch(setNftDetails({ tokenId, ...(details || {}) }));
            }
          })
          .catch((error) => {
            window.console.log('Error after timer complete.');
            window.console.error(error);
          });
      }}
    />
  );
};

export default Footer;
