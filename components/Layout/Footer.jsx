import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from 'antd/lib';
// import { ServiceStatusInfo } from '@autonolas/frontend-library';
import { isGoerli } from 'common-util/functions';
import { getLeaderboardList, getLatestMintedNft } from 'common-util/api';
import {
  setLeaderboard,
  setNftDetails,
  setHealthcheck,
} from 'store/setup/actions';
import { ServiceStatusInfo } from './ServiceStatusInfo';
import { getHealthcheck } from './utils';
import { ExtraContent } from './styles';

const { Text } = Typography;

const COORDTINATION_KIT_URL = 'https://docs.autonolas.network/product/coordinationkit/';

const BuildWith = (
  <>
    BUILD WITH&nbsp;
    <a href={COORDTINATION_KIT_URL} rel="noreferrer">
      CONTRIBUTIONKIT
    </a>
  </>
);

const Footer = () => {
  // selectors & dispatch
  const dispatch = useDispatch();
  const chainId = useSelector((state) => state?.setup?.chainId);
  const account = useSelector((state) => state?.setup?.account);
  const healthDetails = useSelector((state) => state?.setup?.healthcheck);
  const isHealthy = !!healthDetails?.healthy;
  const secondsLeftReceived = healthDetails?.seconds_until_next_update;

  // fetch healthcheck on first render
  useEffect(() => {
    getHealthcheck()
      .then((response) => {
        dispatch(setHealthcheck(response));
      })
      .catch((error) => {
        window.console.error(error);
      });
  }, []);

  const LIST_DOCS = [
    {
      id: 'live-service',
      text: 'Live service',
      redirectTo: 'https://protocol.autonolas.network/services',
      isInternal: true,
    },
    {
      id: 'service-code',
      text: 'Service code',
      redirectTo: 'https://github.com/valory-xyz/contribution-service',
    },
    {
      id: 'contract-code',
      text: 'Contracts',
      redirectTo: isGoerli(chainId)
        ? 'https://goerli.etherscan.io/address/0x7C3B976434faE9986050B26089649D9f63314BD8'
        : 'https://etherscan.io/address/0x02c26437b292d86c5f4f21bbcce0771948274f84',
    },
  ];

  const LIST_CODE = [
    { text: 'Run demo code', redirectTo: `${COORDTINATION_KIT_URL}#demo` },
    {
      text: 'Get help building',
      redirectTo: 'https://propel.valory.xyz',
      isInternal: false,
    },
  ];
  const LIST_CODE_MOBILE = [
    { text: 'Run demo code', redirectTo: `${COORDTINATION_KIT_URL}#demo` },
    {
      text: 'Get help',
      redirectTo: 'https://propel.valory.xyz',
      isInternal: false,
    },
  ];

  const getList = (myList) => myList.map(
    ({
      id, text, redirectTo, isInternal = true, component,
    }, index) => (
      <Fragment key={id}>
        <Text type="secondary">
          {component || (
          <>
            {redirectTo ? (
              <>
                <a
                  href={redirectTo}
                  target={isInternal ? '_self' : '_blank'}
                  rel="noreferrer"
                >
                  {text}
                </a>
              </>
            ) : (
              <>{`${text} (link coming soon)`}</>
            )}
          </>
          )}

          {index !== myList.length - 1 && <>&nbsp;&nbsp;•&nbsp;&nbsp;</>}
        </Text>
      </Fragment>
    ),
  );

  return (
    <ServiceStatusInfo
      isHealthy={isHealthy}
      secondsLeftReceived={secondsLeftReceived}
      extra={(
        <ExtraContent>
          {[
            { id: 'code', name: BuildWith, list: LIST_CODE },
            { id: 'docs', name: 'CODE', list: LIST_DOCS },
          ].map((e) => (
            <div key={e.id}>
              <div>
                <Text className="status-sub-header">{e.name}</Text>
              </div>
              <div className="status-sub-content">{getList(e.list)}</div>
            </div>
          ))}
        </ExtraContent>
      )}
      extraMd={<div>{getList(LIST_CODE_MOBILE)}</div>}
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
