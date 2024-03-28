import { Button, Dropdown, Grid } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useHelpers } from 'common-util/hooks/useHelpers';
import { VerticalDivider } from './styles';
import { formatWeiBalance } from './utils';
import DelegateMenu from './DelegateMenu';
import { useFetchVotingPower } from './hooks';

const { useBreakpoint } = Grid;

const VotingPower = () => {
  const screens = useBreakpoint();

  const { account } = useHelpers();
  const { votingPower, refetchVotingPrower } = useFetchVotingPower(account);

  if (screens.xs) return null;
  if (!votingPower) return null;

  return (
    <>
      <VerticalDivider />
      <Dropdown
        placement="bottomRight"
        arrow
        trigger="click"
        overlay={(
          <DelegateMenu
            votingPower={votingPower}
            refetchVotingPrower={refetchVotingPrower}
          />
        )}
      >
        <Button type="text" className="mr-8">
          Voting power:
          {' '}
          {formatWeiBalance(votingPower)}
          <EditOutlined />
        </Button>
      </Dropdown>
    </>
  );
};

export default VotingPower;
