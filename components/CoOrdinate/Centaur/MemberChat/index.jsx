import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import {
  Button, Input, notification, Space, Card, Typography,
} from 'antd';
import { SendOutlined } from '@ant-design/icons';

/** Import Orbis SDK */
import { Orbis } from '@orbisclub/orbis-sdk';

import { Conversations } from './Conversation';
import {
  getToChatWithDid,
  connectOrbis,
  createOrbisConversation,
  getAllTheMessages,
} from './utils';

const { Title, Text } = Typography;

/**
 * Initialize the Orbis class object:
 * You can make this object available on other components
 * by passing it as a prop or by using a context.
 */
const orbis = new Orbis();

export const MemberChat = () => {
  // messages
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  // input message
  const [inputMessage, setInputMessage] = useState('');

  // send message loading
  const [isSending, setIsSending] = useState(false);

  /** The user object */
  const [user, setUser] = useState();

  const account = useSelector((state) => state?.setup?.account);

  // get address from querystring
  const router = useRouter();
  const toChatWith = router.query.address || null;

  const connect = async () => {
    const did = await connectOrbis(orbis);
    setUser(did);
  };

  const updateAfterSendMessage = () => {
    notification.success({ message: 'Message sent successfully' });
    setMessages((prev) => [
      ...prev,
      { address: account, message: inputMessage },
    ]);
    setInputMessage('');
    setIsSending(false);
  };

  const handleSendMessage = async () => {
    setIsSending(true);

    // check if the user is connected and use the same orbis object
    const isMemberConnected = await orbis?.isConnected();
    if (!isMemberConnected) {
      await connect();
    }

    if (!toChatWith) {
      notification.error({
        message: 'Please provide a valid address to chat with',
      });
    }

    // get the receipient did and create a conversation
    const receipientDid = await getToChatWithDid(orbis, toChatWith);
    const conId = await createOrbisConversation(
      orbis,
      account,
      toChatWith,
      receipientDid,
    );

    // send the message once the conversation is created
    const finalSendMessageResponse = await orbis.sendMessage({
      conversation_id: conId,
      body: inputMessage,
    });

    if (finalSendMessageResponse.error) {
      window.console.log(
        'Error sending message: ',
        finalSendMessageResponse.error,
      );
      return;
    }

    updateAfterSendMessage();
  };

  const getMessagesForTheDid = async () => {
    const list = await getAllTheMessages(orbis, account, toChatWith);

    // we update the message list once "Send" button is clicked
    // so we check if the new message list is greater than the previous one
    if (list.length > messages.length) {
      setMessages(list);
    }
  };

  const isUserConnected = !!user;

  // on load, fetch the messages
  useEffect(async () => {
    if (account && isUserConnected) {
      setIsMessageLoading(true);
      await getMessagesForTheDid();
      setIsMessageLoading(false);
    }
  }, [account, isUserConnected]);

  // poll for messages every 6 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (account && isUserConnected) {
        await getMessagesForTheDid();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [account, isUserConnected]);

  return (
    <Card className="member-chat-card">
      <Space direction="vertical" className="w-100">
        <Title level={3}>Member Chat</Title>
        <Conversations isLoading={isMessageLoading} messages={messages} />
        <Input
          placeholder="Enter message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onPressEnter={handleSendMessage}
          disabled={!isUserConnected}
        />

        <Space>
          <Button
            disabled={!inputMessage || !toChatWith || !isUserConnected}
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            loading={isSending}
          >
            Send
          </Button>

          {!isUserConnected && (
            <>
              <Button
                onClick={async () => {
                  await connect();
                }}
              >
                Connect
              </Button>
              <Text type="secondary">
                Please connect to orbis to chat and see messages
              </Text>
            </>
          )}
        </Space>
      </Space>
    </Card>
  );
};
