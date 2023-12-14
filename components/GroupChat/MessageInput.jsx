import React from 'react';
import {
  Input,
  Row,
  Col,
  Typography,
  Button,
  Form,
} from 'antd';
import { SendOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import {
  StyledGroupChat,
} from './styles';

const { TextArea } = Input;
const { Text } = Typography;

export const MessageInput = ({
  form,
  handleSubmit,
  isSending,
  account,
  isOrbisConnected,
  loadingInitial,
}) => (
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
      <Row
        gutter={[16, 16]}
        className="w-100"
        style={{ display: 'flex', alignItems: 'center' }}
      >
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
              {!loadingInitial && <SendOutlined />}
              {' '}
              Send
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
    {!account && !isOrbisConnected && (
    <Text type="secondary">
      To send messages, connect your wallet and sign in to Orbis
    </Text>
    )}
    {account && !isOrbisConnected && (
    <Text type="secondary">To send messages, sign in to Orbis</Text>
    )}
    {!account && isOrbisConnected && (
    <Text type="secondary">
      To send messages, connect your wallet
    </Text>
    )}
  </StyledGroupChat>
);

MessageInput.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  isSending: PropTypes.bool.isRequired,
  account: PropTypes.string.isRequired,
  isOrbisConnected: PropTypes.bool.isRequired,
  loadingInitial: PropTypes.bool.isRequired,
};
