import { Alert, Flex, Typography } from 'antd';
import Image from 'next/image';

import Login from '../Login';

const { Paragraph } = Typography;

export const ConnectWallet = () => (
  <>
    <Alert
      className="mb-12"
      type="warning"
      showIcon
      message="To be eligible to earn staking rewards you must associate your X profile with your wallet. Make sure to connect a suitable wallet before starting."
    />
    <Flex vertical gap={24} align="center" className="mt-24">
      <Image src="/images/set-up-staking.png" alt="Staking" width={592} height={214} />
      <Paragraph type="secondary" align="center" className="m-0">
        Spread the word about Olas on X and have a chance to earn rewards.
      </Paragraph>
      <Login />
    </Flex>
  </>
);
