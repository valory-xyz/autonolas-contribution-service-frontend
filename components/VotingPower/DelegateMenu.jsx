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
  formatWeiBalanceWithCommas,
  truncateAddress,
} from './utils';
import {
  useFetchDelegatee,
  useFetchDelegatorList,
  useDelegate,
  useUndelegate,
} from './hooks';

const { Text, Paragraph } = Typography;

const DelegateMenu = (props) => {
  const [form] = Form.useForm();
  const { account } = useHelpers();
  const { delegatorList } = useFetchDelegatorList(account);
  const { delegatee, setDelegatee } = useFetchDelegatee(account);

  const { isDelegating, handleDelegate } = useDelegate(account, delegatee);
  const { canUndelegate, isUndelegating, handleUndelegate } = useUndelegate(
    account,
    delegatee,
  );

  const [delegateFormVisible, setDelegateFormVisible] = useState(false);

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
      <Text strong>Your voting power</Text>
      <Paragraph className="my-8">
        {formatWeiBalanceWithCommas(props.balance)}
      </Paragraph>
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
      <Divider className="mt-8 mb-12" />
      <Text strong>Delegated to you:</Text>
      {delegatorList.length > 0 ? (
        delegatorList.map((delegator) => (
          <Paragraph className="my-4" key={delegator} title={delegator}>
            <a
              href={`https://etherscan.io/address/${delegator}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {truncateAddress(delegator, 7, 5)}
            </a>
          </Paragraph>
        ))
      ) : (
        <Paragraph className="my-8">None</Paragraph>
      )}
    </StyledMenu>
  );
};

DelegateMenu.propTypes = {
  balance: PropTypes.string,
};

DelegateMenu.defaultProps = {
  balance: null,
};

export default DelegateMenu;
