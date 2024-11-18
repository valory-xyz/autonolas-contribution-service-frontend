import { Card, Typography } from 'antd';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { ConnectWallet } from './ConnectWallet';
import { StakingStepper } from './StakingStepper';

const { Title } = Typography;

const Root = styled.div`
  max-width: 640px;
  margin: auto;
`;

export const StakingPage = () => {
  const leaderboard = useSelector((state) => state?.setup?.leaderboard);
  const account = useSelector((state) => state?.setup?.account);

  const twitterProfile = useMemo(() => {
    const profile = leaderboard.find((item) => item.wallet_address === account);
    return {
      account: profile?.twitter_handle,
      id: profile?.twitter_id,
      multisig: profile?.service_multisig,
    };
  }, [account, leaderboard]);

  return (
    <Root>
      <Card bordered={false}>
        <Title level={4}>Set up staking</Title>
        {!account && <ConnectWallet />}
        {account && (
          <StakingStepper
            twitterAccount={twitterProfile.account}
            twitterId={twitterProfile.id}
            multisigAddress={twitterProfile.multisig}
          />
        )}
      </Card>
    </Root>
  );
};
