import { Fragment } from 'react';
import { Typography } from 'antd/lib';
import Link from 'next/link';
import { Footer as CommonFooter } from '@autonolas/frontend-library';
import PoweredBy from 'common-util/SVGs/powered-by';
import { DOCS_SECTIONS } from 'components/Documentation/helpers';
import { Hr, ContractsInfoContainer, PoweredByLogo } from './styles';

const { Text } = Typography;

const ContractInfo = () => {
  const LIST = [
    {
      id: '1',
      text: 'Contracts & service code',
      redirectTo: null,
      // redirectTo: getEtherscanLink(),
    },
    {
      id: '2',
      text: 'Learn more about this service',
      redirectTo: `/docs#${DOCS_SECTIONS['how-it-works']}`,
      isExternal: false,
    },
    {
      id: '3',
      text: 'Build your own with CoordinationKit',
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
        id, text, redirectTo, isExternal,
      }, index) => (
        <Fragment key={id}>
          <Text type="secondary">
            {redirectTo ? (
              <>
                {isExternal ? (
                  <a href={redirectTo} target="_blank" rel="noreferrer">
                    {text}
                  </a>
                ) : (
                  <Link href={redirectTo}>{text}</Link>
                )}
              </>
            ) : (
              <>{`${text} (link coming soon)`}</>
            )}

            {index !== LIST.length - 1 && <>&nbsp;&nbsp;•&nbsp;&nbsp;</>}
          </Text>
        </Fragment>
      ))}
    </ContractsInfoContainer>
  );
};

const Footer = () => (
  <>
    <Hr />
    <CommonFooter leftContent={<ContractInfo />} />
  </>
);

export default Footer;
