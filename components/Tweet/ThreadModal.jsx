import React, { useState } from 'react';
import {
  Modal, Button, Input, Avatar, message,
} from 'antd/lib';
import PropTypes from 'prop-types';
import {
  TwitterOutlined,
  CloseOutlined,
  SendOutlined,
} from '@ant-design/icons';

const ThreadModal = ({ closeThreadModal }) => {
  const [thread, setThread] = useState([]);
  const [tweet, setTweet] = useState('');

  const handleOk = () => {
    if (thread.some((t) => t.trim() === '')) {
      message.error('One or more tweets are empty. Please fill them all.');
      return;
    }

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

    setThread([...thread, tweet]);
    setTweet('');
  };

  const isDisabled = thread.some((t) => t.trim() === '');

  return (
    <Modal
      title="Twitter Thread"
      open
      width={600}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" icon={<CloseOutlined />} onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<SendOutlined />}
          onClick={handleOk}
          disabled={isDisabled}
        >
          Post Thread
        </Button>,
      ]}
    >
      <Input.TextArea
        placeholder="Compose your tweet..."
        rows={4}
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
      />
      <Button onClick={addTweet} style={{ marginTop: '10px' }}>
        Add Tweet
      </Button>
      {thread.map((e, index) => (
        <div key={index} style={{ marginTop: '10px' }}>
          <Avatar size="small" icon={<TwitterOutlined />} />
          <span style={{ marginLeft: '5px' }}>{e}</span>
        </div>
      ))}
    </Modal>
  );
};

ThreadModal.propTypes = {
  closeThreadModal: PropTypes.func.isRequired,
};

export default ThreadModal;
