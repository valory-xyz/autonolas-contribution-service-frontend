import {
  Button, Divider, Typography, Form, Input, notification,
} from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { isValidAddress } from '@autonolas/frontend-library';
import { useHelpers } from 'common-util/hooks/useHelpers';
import { StyledMenu } from './styles';
import {
  DELEGATE_ERRORS_MAP,
  formatWeiBalance,
  formatWeiBalanceWithCommas,
  truncateAddress,
} from './utils';
import {
  useFetchDelegatee,
  useVotingPowerBreakdown,
  useDelegate,
  useUndelegate,
} from './hooks';

const { Text, Paragraph } = Typography;

const DelegateMenu = (props) => {
  const [form] = Form.useForm();
  const { account } = useHelpers();

  const { balance, delegatorsBalance, delegatorList } = useVotingPowerBreakdown(account);
  const { delegatee, setDelegatee } = useFetchDelegatee(account);

  const [delegateFormVisible, setDelegateFormVisible] = useState(false);
  const [whoDelegatedVisible, setWhoDelegatedVisible] = useState(false);
  const { isDelegating, handleDelegate } = useDelegate(
    account,
    delegatee,
    balance,
  );
  const { canUndelegate, isUndelegating, handleUndelegate } = useUndelegate(
    account,
    delegatee,
    balance,
  );

  const onSubmitDelegate = (values) => {
    handleDelegate({
      values,
      onSuccess: (address) => {
        setDelegatee(address);
        form.resetFields();
        notification.success({
          message: 'Delegated voting power',
        });
        setDelegateFormVisible(false);
        props.refetchVotingPrower();
      },
      onError: (error) => {
        console.error(error);
        notification.error({
          message: DELEGATE_ERRORS_MAP[error.message] || "Couldn't delegate",
        });
      },
    });
  };

  const onUndelegateClick = () => {
    handleUndelegate({
      onSuccess: () => {
        setDelegatee(null);
        form.resetFields();
      },
      onError: (error) => {
        console.error(error);
        notification.error({
          message: DELEGATE_ERRORS_MAP[error.message] || "Couldn't undelegate",
        });
      },
    });
  };

  return (
    <StyledMenu className="p-12">
      <Text strong>Total voting power</Text>
      <Paragraph className="my-8">
        {formatWeiBalanceWithCommas(props.votingPower)}
      </Paragraph>
      <Text strong>Your voting power</Text>
      <Paragraph className="my-8">
        {delegatee
          ? `0 (${formatWeiBalance(balance || '0')} delegated)`
          : formatWeiBalanceWithCommas(balance || '0')}
      </Paragraph>
      <Text strong>Delegated to you</Text>
      <Paragraph className="my-8">
        {formatWeiBalanceWithCommas(delegatorsBalance)}
      </Paragraph>
      {delegatorList.length > 0 && !whoDelegatedVisible && (
        <Button size="small" onClick={() => setWhoDelegatedVisible(true)}>
          Who delegated to me?
        </Button>
      )}
      {whoDelegatedVisible && (
        <>
          <Button size="small" onClick={() => setWhoDelegatedVisible(false)}>
            Hide
          </Button>
          {delegatorList.map((delegator) => (
            <Paragraph className="my-4" key={delegator} title={delegator}>
              <a
                href={`https://etherscan.io/address/${delegator}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {truncateAddress(delegator, 7, 5)}
              </a>
            </Paragraph>
          ))}
        </>
      )}
      <Divider className="my-8" />
      <Text strong>You’ve delegated to:</Text>
      <Paragraph className="my-8" title={delegatee}>
        {delegatee ? (
          <a
            href={`https://etherscan.io/address/${delegatee}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {truncateAddress(delegatee, 7, 5)}
          </a>
        ) : (
          'None'
        )}
      </Paragraph>
      {delegateFormVisible && (
        <>
          <Button
            size="small"
            className="mb-8"
            onClick={() => setDelegateFormVisible(false)}
          >
            Hide
          </Button>
          <Form onFinish={onSubmitDelegate} form={form}>
            <Form.Item
              name="address"
              className="mb-8"
              rules={[
                {
                  validator(_, value) {
                    return isValidAddress(value)
                      ? Promise.resolve()
                      : Promise.reject(new Error('Invalid input'));
                  },
                },
              ]}
            >
              <Input placeholder="Address to delegate to" />
            </Form.Item>
            <Form.Item className="mb-8">
              <Button htmlType="submit" type="primary" loading={isDelegating}>
                {isDelegating ? 'Delegating' : 'Delegate'}
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
      {!delegateFormVisible && (
        <>
          <Button size="small" onClick={() => setDelegateFormVisible(true)}>
            Delegate
          </Button>
          {canUndelegate && (
            <Button
              className="ml-4"
              size="small"
              loading={isUndelegating}
              onClick={onUndelegateClick}
            >
              Undelegate
            </Button>
          )}
        </>
      )}
    </StyledMenu>
  );
};

DelegateMenu.propTypes = {
  votingPower: PropTypes.string.isRequired,
  refetchVotingPrower: PropTypes.func.isRequired,
};

export default DelegateMenu;
