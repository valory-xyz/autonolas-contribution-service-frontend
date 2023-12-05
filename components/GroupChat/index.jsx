import React, {
  Fragment, useEffect, useState, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import Moment from 'react-moment';
import {
  Input,
  Row,
  Col,
  Typography,
  Button,
  Form,
  Skeleton,
  Divider,
  Modal,
  Collapse,
} from 'antd';
import { COLOR, notifyError } from '@autonolas/frontend-library';
import { useRouter } from 'next/router';
import { SendOutlined } from '@ant-design/icons';

import DisplayName from 'common-util/DisplayName';
import orbis, { createPost } from 'common-util/orbis';
import { checkVeolasThreshold } from 'components/MembersList/requests';
import { ONE_IN_WEI } from 'util/constants';
import {
  EmptyState,
  GroupChatContainer,
  MessageBody,
  MessageContainer,
  MessageGroup,
  MessageTimestamp,
  StyledGroupChat,
  StyledMessageTwoTone,
} from './styles';

const { TextArea } = Input;
const { Text, Title } = Typography;

export const GroupChat = () => {
  const [orbisMessages, setOrbisMessages] = useState([]);
  const [orbisMessagesError, setOrbisMessagesError] = useState('');
  const [showVeOLASModal, setShowVeOLASModal] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const messageWindowRef = useRef(null);
  const account = useSelector((state) => state?.setup?.account);
  const isOrbisConnected = useSelector((state) => state.setup.isConnected);
  const [isSending, setIsSending] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;

  const loadMessages = async (initialLoad = false) => {
    if (!id) return;

    if (initialLoad) setLoadingInitial(true);

    const { data, error } = await orbis.getPosts(
      {
        context: id,
      },
      undefined,
      undefined,
      true,
    );
    setOrbisMessages(data);
    if (error) {
      console.error('Error loading messages:', error);
      setOrbisMessagesError(error.message);
    }

    if (initialLoad) setLoadingInitial(false);
  };

  /** Load all posts for this context */
  useEffect(() => {
    loadMessages(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (messageWindowRef.current) {
      messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight;
    }
  }, [orbisMessages]);

  const handleSubmit = async (formData) => {
    const meetsVeolasThreshold = await checkVeolasThreshold(
      account,
      ONE_IN_WEI,
    );
    // Only check the VeOLAS threshold in production environment
    if (process.env.NODE_ENV === 'production' && !meetsVeolasThreshold) {
      setShowVeOLASModal(true);
      return null;
    }

    const { messageContent } = formData;

    setIsSending(true);
    const { result, error } = await createPost(
      {
        body: messageContent,
        context: id,
      },
      orbis,
    );

    if (error) {
      notifyError('Error sending message: ', error);
      console.error('Error sending message: ', error);
      setIsSending(false);
      return null;
    }

    await loadMessages();

    form.resetFields(['messageContent']);

    setIsSending(false);
    return result;
  };

  const hasMessages = orbisMessages?.length > 0;

  return (
    <GroupChatContainer bordered={false}>
      {id ? (
        <>
          {loadingInitial && <Skeleton active />}
          {orbisMessagesError
            && `Error loading messages: ${orbisMessagesError}`}
          {hasMessages && !loadingInitial && (
            <div ref={messageWindowRef} className="group-chat-container">
              {Object.entries(
                orbisMessages.reduce((acc, msg) => {
                  // Group messages by creator address
                  const address = msg?.creator_details?.metadata?.address || 'unknown';
                  const { timestamp } = msg;
                  const date = new Date(timestamp * 1000);
                  const dateKey = date.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
                  if (!acc[dateKey]) {
                    acc[dateKey] = {};
                  }
                  if (!acc[dateKey][address]) {
                    acc[dateKey][address] = [];
                  }
                  acc[dateKey][address].push(msg);
                  return acc;
                }, {}),
              ).map(([dateKey, messagesByAddress]) => {
                const isToday = new Date().toISOString().split('T')[0] === dateKey;
                return (
                  <div key={dateKey}>
                    <div className="date-segment">
                      <Divider plain>
                        {isToday
                          ? 'Today'
                          : new Date(dateKey).toLocaleDateString()}
                      </Divider>
                    </div>
                    {Object.entries(messagesByAddress).map(
                      ([address, messages]) => (
                        <MessageGroup key={address}>
                          <div className="mb-4">
                            <DisplayName
                              actorAddress={address}
                              account={account}
                            />
                          </div>
                          {messages.map((msg, index) => (
                            <Fragment
                              key={`${msg.content?.context}-${msg.timestamp}`}
                            >
                              <div
                                className={`mb-4 ${index === 0 ? 'mt-2' : ''}`}
                              >
                                <MessageContainer>
                                  <MessageBody>{msg.content?.body}</MessageBody>
                                  <MessageTimestamp type="secondary">
                                    <Moment unix format="HH:mm">
                                      {msg.timestamp}
                                    </Moment>
                                  </MessageTimestamp>
                                </MessageContainer>
                              </div>
                            </Fragment>
                          ))}
                        </MessageGroup>
                      ),
                    )}

                  </div>
                );
              })}
            </div>
          )}

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
        </>
      ) : (
        <EmptyState>
          <div>
            <StyledMessageTwoTone twoToneColor={COLOR.GREY_1} />
            <br />
            <Text type="secondary">To start chatting, select a chat</Text>
          </div>
        </EmptyState>
      )}
      <Modal
        title={
          <Title level={4}>You need at least 1 veOLAS to send messages</Title>
        }
        open={showVeOLASModal}
        onOk={() => setShowVeOLASModal(false)}
        onCancel={() => setShowVeOLASModal(false)}
      >
        <Collapse
          className="mb-12 mt-12"
          items={[
            {
              key: '1',
              label: "What's veOLAS?",
              children: (
                <Text>
                  veOLAS is a locked form of the Olas ecosystem&apos;s token,
                  called OLAS. When you lock OLAS into veOLAS you get access to
                  functionality.
                </Text>
              ),
            },
          ]}
        />
        <Title level={5} className="mb-4">
          How to get veOLAS
        </Title>
        <ol className="mt-0">
          <li>
            <a
              href="https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x0001a500a6b18995b03f44bb040a5ffc28e45cb0"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get OLAS on Ethereum ↗
            </a>
          </li>
          <li>
            Lock your OLAS at
            {' '}
            <a
              href="https://member.olas.network"
              target="_blank"
              rel="noopener noreferrer"
            >
              Olas Member ↗
            </a>
          </li>
        </ol>
        <Text type="secondary">
          Note: it&apos;s worth locking more than 1 veOLAS because your veOLAS
          amount will reduce over time.
        </Text>
      </Modal>
    </GroupChatContainer>
  );
};
