import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Statistic } from 'antd/lib';
import Link from 'next/link';
import { Footer as CommonFooter } from '@autonolas/frontend-library';
import PoweredBy from 'common-util/SVGs/powered-by';
import { isGoerli } from 'common-util/functions';
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
  const chainId = useSelector((state) => state?.setup?.chainId);
  const isHealthy = useSelector(
    (state) => !!state?.setup?.healthcheck?.healthy,
  );
  const secondsLeft = useSelector(
    (state) => state?.setup?.healthcheck?.seconds_untime_next_update,
  );
  const deadline = Date.now() + secondsLeft * 1000;

  const LIST = [
    {
      id: 'health',
      component: (
        <>
          {isHealthy ? (
            <>
              <span className="dot dot-online" />
              &nbsp; Operational
            </>
          ) : (
            <>
              <span className="dot dot-offline" />
              &nbsp; Disrupted
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
          <Countdown
            value={deadline}
            format="ss"
            suffix="s"
            // onFinish={() => console.log('DONE')}
          />
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
