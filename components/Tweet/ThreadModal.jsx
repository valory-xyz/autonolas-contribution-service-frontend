import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Modal,
  Button,
  Input,
  message,
  Steps,
  Row,
  Col,
  Typography,
} from 'antd/lib';
import PropTypes from 'prop-types';
import {
  TwitterOutlined,
  CloseOutlined,
  PlusOutlined,
  EditFilled,
} from '@ant-design/icons';
import { MAX_TWEET_LENGTH } from 'util/constants';
import { TweetLength, ProposalCountRow } from './utils';

const { Text } = Typography;

const EachThreadContainer = styled.div`
  display: flex;
  align-items: flex-start;
  /* align-items: center; */
  justify-content: space-between;
  .thread-col-2 {
  }
`;

const ThreadModal = ({
  firstTweetInThread,
  isSubmitting,
  addThread,
  closeThreadModal,
}) => {
  const [thread, setThread] = useState([]);
  const [tweet, setTweet] = useState('');

  // index of the tweet currently being edited,
  // -1 if no tweet is being edited
  const [currentEditingIndex, setCurrentEditingIndex] = useState(-1);

  useEffect(() => {
    setThread([firstTweetInThread]);
  }, [firstTweetInThread]);

  const onModalClose = () => {
    closeThreadModal();
  };

  // ADD the tweet to the thread
  const onAddToThread = () => {
    if (!tweet || tweet.trim() === '') {
      message.error('Tweet cannot be empty.');
      return;
    }

    // currently editing a thread
    if (currentEditingIndex === -1) {
      const newThread = [...thread, tweet];
      setThread(newThread);
      setTweet(null);
    } else {
      const newThread = [...thread];
      newThread[currentEditingIndex] = tweet;
      setThread(newThread);
      setTweet(null);
      setCurrentEditingIndex(-1);
    }
  };

  // EDIT the tweet in the thread
  const onEditThread = (index) => {
    const newThread = [...thread];
    setTweet(newThread[index]);
    setCurrentEditingIndex(index);
  };

  // REMOVE the tweet from the thread
  const onRemoveFromThread = (index) => {
    const newThread = [...thread];
    newThread.splice(index, 1);
    setThread(newThread);
  };

  // POST the thread to the backend
  const onPostThread = async () => {
    if (thread.some((t) => t.trim() === '')) {
      message.error('One or more tweets are empty. Please fill them all.');
      return;
    }

    try {
      // post the thread & close the modal
      await addThread(thread);

      closeThreadModal();
    } catch (error) {
      message.error('Something went wrong. Please try again.');
    }
  };

  return (
    <Modal
      title="Twitter Thread"
      open
      width={900}
      onOk={onPostThread}
      onCancel={onModalClose}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={onPostThread}
          icon={<TwitterOutlined />}
        >
          Post Thread
        </Button>,
      ]}
    >
      <Row gutter={24}>
        <Col md={12} xs={24}>
          <Input.TextArea
            placeholder="Compose your thread..."
            rows={4}
            value={tweet}
            maxLength={MAX_TWEET_LENGTH}
            onChange={(e) => setTweet(e.target.value)}
          />
          <ProposalCountRow>
            <TweetLength tweet={tweet} />
            <Button
              type="primary"
              ghost
              onClick={onAddToThread}
              disabled={!tweet || tweet.trim() === ''}
              className="mt-12"
            >
              <PlusOutlined />
              Add to thread
            </Button>
          </ProposalCountRow>
        </Col>

        <Col
          md={12}
          xs={24}
          style={{ maxHeight: '400px', minHeight: '300px', overflow: 'auto' }}
        >
          <Steps
            progressDot
            direction="vertical"
            current={thread.length - 1}
            items={thread.map((e, index) => ({
              title: (
                <EachThreadContainer>
                  <Text style={{ whiteSpace: 'pre-wrap' }}>{e}</Text>

                  <div className="thread-col-2">
                    <Button
                      ghost
                      type="primary"
                      size="small"
                      icon={<EditFilled />}
                      onClick={() => onEditThread(index)}
                    />

                    {thread.length > 1 && (
                      <Button
                        danger
                        className="ml-8"
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={() => onRemoveFromThread(index)}
                      />
                    )}
                  </div>
                </EachThreadContainer>
              ),
            }))}
          />
        </Col>
      </Row>
    </Modal>
  );
};

ThreadModal.propTypes = {
  firstTweetInThread: PropTypes.string.isRequired,
  closeThreadModal: PropTypes.func.isRequired,
  addThread: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

ThreadModal.defaultProps = {
  isSubmitting: false,
};

export default ThreadModal;
