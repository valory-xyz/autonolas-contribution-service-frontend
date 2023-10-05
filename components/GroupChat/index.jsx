import React, {
  Fragment, useEffect, useState, useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import {
  Input, Row, Col, Typography, Button, Form,
} from 'antd/lib';
import { setMemoryDetails } from 'store/setup/actions';
import { getMemoryDetails, updateMemoryDetails } from 'common-util/api';
import { notifyError } from 'common-util/functions';
import DisplayName from 'common-util/DisplayName';
import { DEFAULT_COORDINATE_ID } from 'util/constants';
import { GroupChatContainer, StyledGroupChat } from './styles';
import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';

const { TextArea } = Input;
const { Text } = Typography;

const GroupChat = ({ chatEnabled }) => {
  const dispatch = useDispatch();
  const messageWindowRef = useRef(null);
  const account = useSelector((state) => state?.setup?.account);
  const displayName = account;
  const { currentMemoryDetails, isAddressPresent } = useCentaursFunctionalities();
  const [isSending, setIsSending] = useState(false);

  const centaurId = DEFAULT_COORDINATE_ID;
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

  return (
    <GroupChatContainer title="Chat" bodyStyle={{ paddingTop: 0 }}>
      {currentMemoryDetails?.messages?.length ? (
        <div ref={messageWindowRef} className="group-chat-container">
          {isAddressPresent ? (
            currentMemoryDetails.messages.map((msg) => (
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
            <div className="mt-24">
              <Text type="secondary">To see messages, first join Contribute</Text>
            </div>
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
  chatEnabled: PropTypes.bool,
};

GroupChat.defaultProps = {
  chatEnabled: false,
};

export default GroupChat;
