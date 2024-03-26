import { Button, Dropdown } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useHelpers } from 'common-util/hooks/useHelpers';
import { VerticalDivider } from './styles';
import { formatWeiBalance } from './utils';
import DelegateMenu from './DelegateMenu';
import { useVeolasBalance } from './hooks';

const VotingPower = () => {
  const { account } = useHelpers();
  const { balance } = useVeolasBalance(account);

  if (!balance) return null;

  return (
    <>
      <VerticalDivider />
      <Dropdown
        placement="bottomRight"
        arrow
        trigger="click"
        overlay={<DelegateMenu balance={balance} />}
      >
        <Button type="text" className="mr-8">
          Voting power:
          {' '}
          {formatWeiBalance(balance)}
          <EditOutlined />
        </Button>
      </Dropdown>
    </>
  );
};

export default VotingPower;
