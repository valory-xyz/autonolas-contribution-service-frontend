import { Fragment } from 'react';
import { Typography } from 'antd/lib';
import { Footer as CommonFooter } from '@autonolas/frontend-library';
import PoweredBy from 'common-util/SVGs/powered-by';
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
      // redirectTo: 'https://docs.autonolas.network/',
      redirectTo: null,
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

      {LIST.map(({ id, text, redirectTo }, index) => (
        <Fragment key={id}>
          <Text type="secondary">
            {redirectTo ? (
              <a href={redirectTo} target="_blank" rel="noreferrer">
                {text}
              </a>
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
