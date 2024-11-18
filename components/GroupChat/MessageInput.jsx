import { SendOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

import { useHelpers } from 'common-util/hooks/useHelpers';

import { StyledGroupChat } from './styles';

const { TextArea } = Input;
const { Text } = Typography;

export const MessageInput = ({
  form,
  handleSubmit,
  isSending,
  isOrbisConnected,
  loadingInitial,
}) => {
  const { account } = useHelpers();

  return (
    <StyledGroupChat>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="inline"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.submit();
          }
        }}
      >
        <Row gutter={[16, 16]} className="w-100" style={{ display: 'flex', alignItems: 'center' }}>
          <Col flex="auto">
            <Form.Item name="messageContent">
              <TextArea rows={1} className="w-100" disabled={isSending} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button
                htmlType="submit"
                disabled={!account || !isOrbisConnected}
                loading={isSending}
              >
                {!loadingInitial && <SendOutlined />} Send
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Text type="secondary">
        {!account &&
          !isOrbisConnected &&
          'To send messages, connect your wallet and sign in to Orbis'}
        {account && !isOrbisConnected && 'To send messages, sign in to Orbis'}
        {!account && isOrbisConnected && 'To send messages, connect your wallet'}
      </Text>
    </StyledGroupChat>
  );
};

MessageInput.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  isSending: PropTypes.bool.isRequired,
  isOrbisConnected: PropTypes.bool.isRequired,
  loadingInitial: PropTypes.bool.isRequired,
};
