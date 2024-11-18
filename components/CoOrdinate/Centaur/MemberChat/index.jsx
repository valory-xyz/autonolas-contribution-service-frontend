import { SendOutlined } from '@ant-design/icons';
import { Button, Card, Input, Space, Typography, notification } from 'antd';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import useOrbis from 'common-util/hooks/useOrbis';
import orbis from 'common-util/orbis';

import { Conversations } from './Conversation';
import { createOrbisConversation, getAllTheMessages, getToChatWithDid } from './utils';

const { Title, Text } = Typography;

export const MemberChat = () => {
  const { isOrbisConnected } = useOrbis();
  // messages
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  // input message
  const [inputMessage, setInputMessage] = useState('');

  // send message loading
  const [isSending, setIsSending] = useState(false);

  const account = useSelector((state) => state?.setup?.account);

  // get address from querystring
  const router = useRouter();
  const toChatWith = router.query.address || null;

  const updateAfterSendMessage = () => {
    setMessages((prev) => [...prev, { address: account, message: inputMessage }]);
    setInputMessage('');
    setIsSending(false);
  };

  const handleSendMessage = async () => {
    setIsSending(true);

    if (!isOrbisConnected) {
      notification.error({
        message: 'Please sign in to Orbis to send messages',
      });
      return;
    }

    if (!toChatWith) {
      notification.error({
        message: 'Please provide a valid address to chat with',
      });
    }

    // get the recipient did and create a conversation
    const recipientDid = await getToChatWithDid(orbis, toChatWith);
    const conId = await createOrbisConversation(orbis, account, toChatWith, recipientDid);

    // send the message once the conversation is created
    const finalSendMessageResponse = await orbis.sendMessage({
      conversation_id: conId,
      body: inputMessage,
    });

    if (finalSendMessageResponse.error) {
      window.console.log('Error sending message: ', finalSendMessageResponse.error);
      return;
    }

    updateAfterSendMessage();
  };

  const getMessagesForTheDid = useCallback(async () => {
    const list = await getAllTheMessages(orbis, account, toChatWith);

    // we update the message list once "Send" button is clicked
    // so we check if the new message list is greater than the previous one
    if (list.length > messages.length) {
      setMessages(list);
    }
  }, [account, messages.length, toChatWith]);

  // on load, fetch the messages
  useEffect(() => {
    const getData = async () => {
      setIsMessageLoading(true);
      await getMessagesForTheDid();
      setIsMessageLoading(false);
    };

    if (account && isOrbisConnected) {
      getData();
    }
  }, [account, getMessagesForTheDid, isOrbisConnected]);

  // poll for messages every 6 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (account && isOrbisConnected) {
        await getMessagesForTheDid();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [account, getMessagesForTheDid, isOrbisConnected]);

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
          disabled={!isOrbisConnected}
        />

        <Space>
          <Button
            disabled={!inputMessage || !toChatWith || !isOrbisConnected}
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            loading={isSending}
          >
            Send
          </Button>

          {!isOrbisConnected && (
            <Text type="secondary">Sign in to Orbis to chat and see messages</Text>
          )}
        </Space>
      </Space>
    </Card>
  );
};
