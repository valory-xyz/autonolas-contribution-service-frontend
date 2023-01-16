import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Statistic } from 'antd/lib';
import Link from 'next/link';
import isNil from 'lodash/isNil';
import { Footer as CommonFooter } from '@autonolas/frontend-library';
import PoweredBy from 'common-util/SVGs/powered-by';
import { isGoerli } from 'common-util/functions';
import { getLeaderboardList, getLatestMintedNft } from 'common-util/api';
import {
  setLeaderboard,
  setNftDetails,
  setHealthcheck,
} from 'store/setup/actions';
import { DOCS_SECTIONS } from 'components/Documentation/helpers';
import { ServiceStatusInfo } from './ServiceStatusInfo';
import { getHealthcheck } from './utils';
import {
  FixedFooter,
  ContractsInfoContainer,
  PoweredByLogo,
  NextUpdateTimer,
} from './styles';

const { Text } = Typography;
const { Countdown } = Statistic;

const ContractInfo = () => {
  const [seconds, setSeconds] = useState(null);
  // const [myKey, setMykey] = useState('1');

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

  // update the timer seconds when time is updated from BE
  useEffect(() => {
    setSeconds(secondsLeftReceived);
  }, [secondsLeftReceived]);

  const LIST_1 = [
    {
      id: 'health',
      component: (
        <>
          {isHealthy ? (
            <>
              <span className="dot dot-online" />
              &nbsp;Operational
            </>
          ) : (
            <>
              <span className="dot dot-offline" />
              &nbsp;Disrupted
            </>
          )}
        </>
      ),
    },
    {
      id: 'next-update',
      component: (
        <NextUpdateTimer>
          Next Update:&nbsp;
          {isNil(seconds) ? (
            '--'
          ) : (
            <Countdown
              // key={myKey}
              value={Date.now() + Math.round(seconds) * 1000}
              format="ss"
              suffix="s"
              onFinish={async () => {
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
                    // reseting timer to 0 as it is finished
                    setSeconds(0);

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
                      const { details, tokenId } = await getLatestMintedNft(
                        account,
                      );
                      dispatch(setNftDetails({ tokenId, ...(details || {}) }));
                    }

                    // start the timer again
                    // setSeconds(secondsLeftReceived);
                    // setMykey((c) => `${Number(c) + 1}`);
                  })
                  .catch((error) => {
                    window.console.log('Error after timer complete.');
                    window.console.error(error);
                  });
              }}
            />
          )}
        </NextUpdateTimer>
      ),
    },
  ];

  const LIST = [
    {
      id: 'contract-code',
      text: 'Contracts',
      redirectTo: isGoerli(chainId)
        ? 'https://goerli.etherscan.io/address/0x7C3B976434faE9986050B26089649D9f63314BD8'
        : 'https://etherscan.io/address/0x02c26437b292d86c5f4f21bbcce0771948274f84',
    },
    {
      id: 'service-code',
      text: 'Service code',
      redirectTo: 'https://github.com/valory-xyz/contribution-service',
    },
    {
      id: '2',
      text: 'Learn more',
      redirectTo: `/docs#${DOCS_SECTIONS['how-it-works']}`,
      isInternal: true,
    },
    {
      id: '3',
      text: 'Build your own',
      // redirectTo: 'https://www.autonolas.network/coordinationkit',
      redirectTo: null,
    },
  ];

  const getList = (myList) => myList.map(({
    id, text, redirectTo, isInternal, component,
  }, index) => (
    <Fragment key={id}>
      <Text type="secondary">
        {component || (
        <>
          {redirectTo ? (
            <>
              {isInternal ? (
                <Link href={redirectTo}>{text}</Link>
              ) : (
                <a href={redirectTo} target="_blank" rel="noreferrer">
                  {text}
                </a>
              )}
            </>
          ) : (
            <>{`${text} (link coming soon)`}</>
          )}
        </>
        )}

        {index !== LIST.length - 1 && <>&nbsp;&nbsp;•&nbsp;&nbsp;</>}
      </Text>
    </Fragment>
  ));

  return (
    <>
      <ContractsInfoContainer>
        <PoweredByLogo>
          <a href="https://autonolas.network" target="_blank" rel="noreferrer">
            <PoweredBy />
          </a>
        </PoweredByLogo>
        {getList([...LIST_1, ...LIST])}
      </ContractsInfoContainer>

      <ServiceStatusInfo
        isHealthy={isHealthy}
        // isHealthy={undefined}
        secondsLeftReceived={seconds}
        extra={(
          <div>
            <Text className="row-1">CODE</Text>
            {getList(LIST)}
          </div>
        )}
        extraMd={<div>{getList(LIST)}</div>}
        onMinimizeToggle={(isMinimized) => console.log({ isMinimized })}
      />
    </>
  );
};

const Footer = () => (
  <FixedFooter>
    <CommonFooter leftContent={<ContractInfo />} />
  </FixedFooter>
);

export default Footer;
