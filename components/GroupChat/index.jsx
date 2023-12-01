// TODO - create modal to guide people to get veOLAS if they try to send a message without it
import React, {
  Fragment, useEffect, useState, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import Moment from 'react-moment';
import {
  Input, Row, Col, Typography, Button, Form, Skeleton, Divider,
} from 'antd';
import { COLOR, notifyError } from '@autonolas/frontend-library';

import DisplayName from 'common-util/DisplayName';
import { useRouter } from 'next/router';
import { MessageTwoTone, SendOutlined } from '@ant-design/icons';
import orbis, { createPost } from 'common-util/orbis';
import { GroupChatContainer, MessageGroup, StyledGroupChat } from './styles';

const { TextArea } = Input;
const { Text } = Typography;

export const GroupChat = () => {
  const [orbisMessages, setOrbisMessages] = useState([]);
  const [orbisMessagesError, setOrbisMessagesError] = useState('');
  const [loading, setLoading] = useState(false);
  const messageWindowRef = useRef(null);
  const account = useSelector((state) => state?.setup?.account);
  const isOrbisConnected = useSelector((state) => state.setup.isConnected);
  const [isSending, setIsSending] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data } = await orbis.getPosts({
        context: id,
      }, undefined, undefined, true);
      setOrbisMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      setOrbisMessagesError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /** Load all posts for this context */
  useEffect(() => {
    loadMessages();
  }, [id]);

  useEffect(() => {
    if (messageWindowRef.current) {
      messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight;
    }
  }, [orbisMessages]);

  const handleSubmit = async (formData) => {
    const { messageContent } = formData;

    setIsSending(true);

    const { result, error } = await createPost({
      body: messageContent,
      context: id,
    }, orbis);

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
          {loading && <Skeleton active />}
          {orbisMessagesError && `Error loading messages: ${orbisMessagesError}`}
          {(hasMessages && !loading) && (
            <div ref={messageWindowRef} className="group-chat-container">
              {Object.entries(orbisMessages.reduce((acc, msg) => {
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
              }, {})).map(([dateKey, messagesByAddress]) => {
                const isToday = new Date().toISOString().split('T')[0] === dateKey;
                return (
                  <div key={dateKey}>
                    <div className="date-segment">
                      <Divider plain>{isToday ? 'Today' : new Date(dateKey).toLocaleDateString()}</Divider>
                    </div>
                    {Object.entries(messagesByAddress).map(([address, messages]) => (
                      <MessageGroup key={address}>
                        <div className="mb-4">
                          <DisplayName
                            actorAddress={address}
                            account={account}
                          />
                        </div>
                        {messages.map((msg, index) => (
                          <Fragment key={`${msg.content?.context}-${msg.timestamp}`}>
                            <div className={`mb-4 ${index === 0 ? 'mt-2' : ''}`}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text className="mr-8" style={{ lineHeight: 1.3 }}>{msg.content?.body}</Text>
                                <Text type="secondary" style={{ minWidth: 50, textAlign: 'right' }}>
                                  <Moment unix format="HH:mm">
                                    {msg.timestamp}
                                  </Moment>
                                </Text>
                              </div>
                            </div>
                          </Fragment>
                        ))}
                      </MessageGroup>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          <StyledGroupChat>
            <Form form={form} onFinish={handleSubmit} layout="inline">
              <Row gutter={[16, 16]} className="w-100" style={{ direction: 'flex', alignItems: 'center' }}>
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
                      <SendOutlined />
                      Send
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            {(!account && !isOrbisConnected) && (
              <Text type="secondary">To send messages, connect your wallet and sign in to Orbis</Text>
            )}
            {(account && !isOrbisConnected) && (
              <Text type="secondary">To send messages, sign in to Orbis</Text>
            )}
            {(!account && isOrbisConnected) && (
              <Text type="secondary">To send messages, connect your wallet</Text>
            )}
          </StyledGroupChat>
        </>
      ) : (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20vh',
        }}
        >
          <div style={{ textAlign: 'center' }}>
            <MessageTwoTone style={{ fontSize: '4rem', marginBottom: '16px' }} twoToneColor={COLOR.GREY_1} />
            <br />
            <Text type="secondary">To start chatting, select a chat</Text>
          </div>
        </div>
      )}
    </GroupChatContainer>
  );
};
// {
//     "stream_id": "kjzl6cwe1jw1484pmywzbf9lfkjwg3gh3kabsc09gw0tnfplmfp9zxou3bqx23d",
//     "type": null,
//     "content": {
//       "body": "test",
//       "context": "kjzl6cwe1jw14b8gwhyz4oen68aaoatycg8l8gix08ckoi0fwk5wvjtp3g89bmh"
//     },
//     "context": "kjzl6cwe1jw14b8gwhyz4oen68aaoatycg8l8gix08ckoi0fwk5wvjtp3g89bmh",
//     "creator": "did:pkh:eip155:1:0x6c6766e04ef971367d27e720d1d161a9b495d647",
//     "creator_details": {
//       "a_r": 0,
//       "did": "did:pkh:eip155:1:0x6c6766e04ef971367d27e720d1d161a9b495d647",
//       "nonces": {
//         "global": 0,
//         "mainnet": 0,
//         "polygon": 0,
//         "arbitrum": 0
//       },
//       "profile": null,
//       "metadata": {
//         "chain": "eip155:1",
//         "address": "0x6c6766e04ef971367d27e720d1d161a9b495d647",
//         "ensName": null
//       },
//       "github_details": null,
//       "verified_email": null,
//       "count_followers": 0,
//       "count_following": 0,
//       "encrypted_email": null,
//       "twitter_details": null
//     },
//     "context_details": {
//       "context_id": "kjzl6cwe1jw14b8gwhyz4oen68aaoatycg8l8gix08ckoi0fwk5wvjtp3g89bmh",
//       "context_details": {
//         "name": "general",
//         "context": "kjzl6cwe1jw14ayy9pnrvdn2qwfeozwyxhwj9l0tz5vu0bp3yl20qq2w5fu7mu4",
//         "imageUrl": "",
//         "project_id": "kjzl6cwe1jw145erd6cl7quyc5zwy649iuty9xr0ycn2dpa0wnvehei6yn38pwx",
//         "websiteUrl": "",
//         "accessRules": [],
//         "displayName": "General",
//         "integrations": {}
//       }
//     },
//     "master": null,
//     "reply_to": null,
//     "reply_to_details": null,
//     "reply_to_creator_details": null,
//     "repost_details": {
//       "content": null,
//       "stream_id": null,
//       "timestamp": null,
//       "count_likes": null,
//       "count_repost": null,
//       "count_replies": null,
//       "creator_details": null
//     },
//     "repost_creator_details": null,
//     "count_likes": 0,
//     "count_haha": 0,
//     "count_downvotes": 0,
//     "count_replies": 0,
//     "count_repost": 0,
//     "timestamp": 1701186975,
//     "count_commits": 1,
//     "indexing_metadata": {
//       "language": "eng"
//     },
//     "last_reply_timestamp": 1701186975
//   }
