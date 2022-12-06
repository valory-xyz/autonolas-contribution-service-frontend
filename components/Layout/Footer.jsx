import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from 'antd/lib';
import get from 'lodash/get';
import { Footer as CommonFooter } from '@autonolas/frontend-library';
import PoweredBy from 'common-util/SVGs/powered-by';
import { Hr, ContractsInfoContainer, PoweredByLogo } from './styles';

const { Text } = Typography;

export const ADDRESSES = {
  1: {
    mintNft: '0x2F1f7D38e4772884b88f3eCd8B6b9faCdC319112',
  },
  5: {
    mintNft: '0xEB5638eefE289691EcE01943f768EDBF96258a80',
  },
};

const ContractInfo = () => {
  const chainId = useSelector((state) => get(state, 'setup.chainId'));
  const address = (ADDRESSES[chainId] || {}).mintNft;

  const getEtherscanLink = () => {
    if (chainId === 5) return `https://goerli.etherscan.io/address/${address}`;
    return `https://etherscan.io/address/${address}`;
  };

  const LIST = [
    {
      id: '1',
      text: 'Contracts & service code',
      redirectTo: getEtherscanLink(),
    },
    {
      id: '2',
      text: 'Learn more about this service',
      redirectTo: 'https://docs.autonolas.network/',
    },
    {
      id: '3',
      text: 'Build your own with CoordinationKit',
      redirectTo: 'https://www.autonolas.network/coordinationkit',
    },
  ];

  return (
    <ContractsInfoContainer>
      {/* <img
        alt="Etherscan link"
        width={18}
        height={18}
        src="/images/powered-by.svg"
      /> */}
      <PoweredByLogo>
        <PoweredBy />
      </PoweredByLogo>

      {LIST.map(({ id, text, redirectTo }, index) => (
        <Fragment key={id}>
          <Text type="secondary">
            <a href={redirectTo} target="_blank" rel="noreferrer">
              {text}
            </a>
          </Text>
          {index !== LIST.length - 1 && <>&nbsp;&nbsp;•&nbsp;&nbsp;</>}
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
