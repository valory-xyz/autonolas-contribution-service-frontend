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

  // TODO: need to switch to Base chain at some point here
  // Otherwise create&stake won't work
  // Requires discussion with Roman

  const twitterProfile = useMemo(() => {
    const profile = leaderboard.find((item) => item.wallet_address === account);
    return {
      account: profile?.twitter_handle,
      id: profile?.twitter_id,
    }
  }, [leaderboard])

  return (
    <Root>
      <Card>
        <Title level={4}>Set up staking</Title>
        {!account && <ConnectWallet />}
        {account && (
          <StakingStepper
            twitterAccount={twitterProfile.account}
            twitterId={twitterProfile.id}
          />
        )}
      </Card>
    </Root>
  );
};
