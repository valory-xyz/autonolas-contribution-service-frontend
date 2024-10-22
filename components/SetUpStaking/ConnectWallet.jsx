import { Flex, Alert, Typography } from 'antd';
import Image from 'next/image';
import Login from '../Login';

const { Paragraph } = Typography;

export const ConnectWallet = () => (
  <>
    <Alert
      className="mb-12"
      type="warning"
      showIcon
      closable
      message="To be eligible to earn staking rewards you must associate your Twitter profile with your wallet. Make sure to connect a suitable wallet."
    />
    <Flex vertical gap={24} align="center" className="mt-24">
      <Image
        src="/images/set-up-staking.png"
        alt="Staking"
        width={505}
        height={77}
      />
      <Paragraph type="secondary" align="center" className="m-0" style={{ maxWidth: 500 }}>
        Spread the word about Olas on Twitter and have a chance to earn staking rewards.
      </Paragraph>
      <Login />
    </Flex>
  </>
)