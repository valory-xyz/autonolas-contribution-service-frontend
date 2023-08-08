import React, {
  Fragment, useEffect, useState, useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
  Input, Row, Col, Typography, Button, Form, Card,
} from 'antd/lib';
import { setMemoryDetails } from 'store/setup/actions';
import { getMemoryDetails, updateMemoryDetails } from 'common-util/api';
import { notifyError } from 'common-util/functions';
import DisplayName from 'common-util/DisplayName';
import { CENTAUR_BOT_ADDRESS } from 'util/constants';
import { GroupChatContainer, StyledGroupChat } from './styles';
import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';

const { TextArea } = Input;
const { Text } = Typography;

const buildMessageStream = (currentMemoryDetails) => {
  const { messages, actions } = currentMemoryDetails;

  const actionsAsMessages = (actions || []).map((action) => ({
    member: CENTAUR_BOT_ADDRESS,
    content: `${action.actorAddress} ${action.description}`,
    timestamp: action.timestamp,
  }));

  const messagesAndActions = [
    ...(messages || []).slice(0),
    ...actionsAsMessages,
  ].sort((a, b) => a.timestamp - b.timestamp);

  return messagesAndActions;
};

const GroupChat = ({ displayName, chatEnabled }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const messageWindowRef = useRef(null);
  const account = useSelector((state) => state?.setup?.account);
  const { currentMemoryDetails, isAddressPresent } = useCentaursFunctionalities();
  const [isSending, setIsSending] = useState(false);

  const centaurId = router?.query?.id;
  const [form] = Form.useForm();

  const memoryDetailsList = useSelector(
    (state) => state?.setup?.memoryDetails || [],
  );

  useEffect(() => {
    if (messageWindowRef.current) {
      messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight;
    }
  }, [currentMemoryDetails]);

  const updateMessages = async (newMessage) => {
    try {
      const updatedMessages = [
        ...(currentMemoryDetails.messages || []),
        newMessage,
      ];

      const updatedMemoryDetails = memoryDetailsList.map((centaur) => {
        if (centaur.id === centaurId) {
          return { ...centaur, messages: updatedMessages };
        }
        return centaur;
      });

      await updateMemoryDetails(updatedMemoryDetails);

      const { response } = await getMemoryDetails();
      dispatch(setMemoryDetails(response));
    } catch (error) {
      notifyError('Error updating messages');
    }
  };

  const handleSubmit = async (formData) => {
    const { messageContent } = formData;

    if (!messageContent.trim()) return;

    const newMessage = {
      member: displayName,
      timestamp: new Date().getTime(),
      content: messageContent,
    };

    try {
      setIsSending(true);
      await updateMessages(newMessage);
      form.resetFields(['messageContent']);
    } catch (error) {
      notifyError('Error sending messages');
    } finally {
      setIsSending(false);
    }
  };

  const getAlignmentClass = (msg) => (displayName === msg.member ? 'my-message' : '');

  const messageStream = buildMessageStream(currentMemoryDetails);

  return (
    <GroupChatContainer title="Members Chat">
      {messageStream.length ? (
        <div ref={messageWindowRef} className="group-chat-container">
          {isAddressPresent ? (
            messageStream.map((msg) => (
              <Fragment key={`${msg.sender}-${msg.timestamp}`}>
                <div className={`${getAlignmentClass(msg)} mb-24`}>
                  {msg.member === account ? (
                    <Text type="secondary" className="text-small">
                      You
                    </Text>
                  ) : (
                    <DisplayName
                      actorAddress={msg.member}
                      account={account}
                      className="text-small"
                    />
                  )}
                  <br />
                  <div className={`${getAlignmentClass(msg)} chat-bubble`}>
                    <Text>{msg.content}</Text>
                    <br />
                    <Text type="secondary" className="text-small">
                      <Moment unix fromNow>
                        {msg.timestamp / 1000}
                      </Moment>
                    </Text>
                  </div>
                </div>
                <div className="clear" />
              </Fragment>
            ))
          ) : (
            <Card>To see messages, first join Contribute</Card>
          )}
        </div>
      ) : (
        <Text type="secondary">No messages yet</Text>
      )}

      <StyledGroupChat>
        <Form form={form} onFinish={handleSubmit} layout="inline">
          {chatEnabled && (
            <Row gutter={[16, 16]} className="w-100">
              <Col flex="auto">
                <Form.Item name="messageContent">
                  <TextArea rows={2} className="w-100" disabled={isSending} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    disabled={!account}
                    loading={isSending}
                  >
                    Send
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
        {!account && (
          <Text type="secondary">To send messages, connect wallet</Text>
        )}
      </StyledGroupChat>
    </GroupChatContainer>
  );
};

GroupChat.propTypes = {
  displayName: PropTypes.string,
  chatEnabled: PropTypes.bool,
};

GroupChat.defaultProps = {
  displayName: '',
  chatEnabled: false,
};

export default GroupChat;
