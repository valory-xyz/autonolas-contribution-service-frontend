import { useMemo } from 'react'
import { Card, Typography } from 'antd';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ConnectWallet } from './ConnectWallet';
import { StakingStepper } from './StakingStepper';

const { Title } = Typography;

const Root = styled.div`
  max-width: 640px;
  margin: auto;
`;

export const SetUpStakingPage = () => {
  const leaderboard = useSelector((state) => state?.setup?.leaderboard);
  const account = useSelector((state) => state?.setup?.account);

  const twitterAccount = useMemo(() => {
    const profile = leaderboard.find((item) => item.wallet_address === account);
    return profile?.twitter_handle
  }, [leaderboard])

  return (
    <Root>
      <Card>
        <Title level={4}>Set up staking</Title>
        {!account && <ConnectWallet />}
        {account && <StakingStepper twitterAccount={twitterAccount} />}
      </Card>
    </Root>
  );
};
