import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Statistic } from 'antd/lib';
import Link from 'next/link';
import isNil from 'lodash/isNil';
import { Footer as CommonFooter } from '@autonolas/frontend-library';
import PoweredBy from 'common-util/SVGs/powered-by';
import { isGoerli } from 'common-util/functions';
import { getLeaderboardList, getLatestMintedNft } from 'common-util/api';
import { setLeaderboard, setNftDetails } from 'store/setup/actions';
import { DOCS_SECTIONS } from 'components/Documentation/helpers';
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
  const [myKey, setMykey] = useState('1');

  // selectors & dispatch
  const dispatch = useDispatch();
  const chainId = useSelector((state) => state?.setup?.chainId);
  const account = useSelector((state) => state?.setup?.account);
  const isHealthy = useSelector(
    (state) => !!state?.setup?.healthcheck?.healthy,
  );
  const secondsLeftReceived = useSelector(
    (state) => state?.setup?.healthcheck?.seconds_until_next_update,
  );

  useEffect(() => {
    setSeconds(secondsLeftReceived);
  }, [secondsLeftReceived]);

  const LIST = [
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
              key={myKey}
              value={Date.now() + seconds * 1000}
              format="ss"
              suffix="s"
              onFinish={async () => {
                // update leaderboard
                const response = await getLeaderboardList();
                dispatch(setLeaderboard(response));

                if (account) {
                  // update badge
                  const { details, tokenId } = await getLatestMintedNft(
                    account,
                  );
                  dispatch(setNftDetails({ tokenId, ...(details || {}) }));
                }

                // start the timer again
                setSeconds(secondsLeftReceived);
                setMykey((c) => `${Number(c) + 1}`);
              }}
            />
          )}
        </NextUpdateTimer>
      ),
    },
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

  return (
    <ContractsInfoContainer>
      <PoweredByLogo>
        <a href="https://autonolas.network" target="_blank" rel="noreferrer">
          <PoweredBy />
        </a>
      </PoweredByLogo>

      {LIST.map(({
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
      ))}
    </ContractsInfoContainer>
  );
};

const Footer = () => (
  <FixedFooter>
    <CommonFooter leftContent={<ContractInfo />} />
  </FixedFooter>
);

export default Footer;
