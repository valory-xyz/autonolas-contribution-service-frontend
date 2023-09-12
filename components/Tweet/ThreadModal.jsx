import React, { useEffect, useState } from 'react';
import {
  Modal, Button, Input, message, Steps, Row, Col,
} from 'antd/lib';
import PropTypes from 'prop-types';
import {
  TwitterOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { MAX_TWEET_LENGTH } from 'util/constants';
import { TweetLength, ProposalCountRow } from './utils';

const ThreadModal = ({
  firstTweetInThread,
  isSubmitting,
  addThread,
  closeThreadModal,
}) => {
  const [thread, setThread] = useState([]);
  const [tweet, setTweet] = useState('');

  useEffect(() => {
    setThread([firstTweetInThread]);
  }, [firstTweetInThread]);

  const handleOk = async () => {
    if (thread.some((t) => t.trim() === '')) {
      message.error('One or more tweets are empty. Please fill them all.');
      return;
    }

    await addThread(thread);

    closeThreadModal();
    // Add logic to post the thread here
  };

  const handleCancel = () => {
    closeThreadModal();
  };

  const addTweet = () => {
    if (tweet.trim() === '') {
      message.error('Tweet cannot be empty.');
      return;
    }

    const newThread = [...thread];
    // newThread[thread.length - 1] = tweet;
    // newThread.push('');
    newThread.push(tweet);

    setThread(newThread);
    setTweet('');
  };

  // const isDisabled = thread.some((t) => t.trim() === '');

  return (
    <Modal
      title="Twitter Thread"
      open
      width={900}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" icon={<CloseOutlined />} onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          // disabled={isDisabled}
          loading={isSubmitting}
          onClick={handleOk}
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
            value={tweet.trim()}
            maxLength={MAX_TWEET_LENGTH}
            onChange={(e) => setTweet(e.target.value)}
            onPressEnter={() => {
              setThread([...thread, tweet]);
              setTweet('');
            }}
          />
          <ProposalCountRow>
            <TweetLength tweet={tweet} />
            <Button
              type="primary"
              ghost
              onClick={addTweet}
              disabled={tweet.trim() === ''}
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
          style={{ maxHeight: '400px', minHeight: '300px', overflow: 'flow' }}
        >
          <Steps
            progressDot
            direction="vertical"
            current={thread.length - 1}
            // current={
            //   tweet.trim() === '' ? thread.length - 2 : thread.length - 1
            // }
            items={thread.map((e) => ({ title: e }))}
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
