import React, { useState } from 'react';
import {
  Modal, Button, Input, Row, Col, message,
} from 'antd';
import PropTypes from 'prop-types';
import {
  TwitterOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { MAX_TWEET_IMAGES, MAX_TWEET_LENGTH } from 'util/constants';
import TweetLength from './TweetLength';
import { ViewThread } from './ViewThread';
import UploadButton from './UploadButton';
import {
  ProposalCountRow,
} from './styles';
import MediaList from './MediaList';

const ThreadModal = ({
  firstTweetInThread,
  firstMediaInThread,
  isSubmitting,
  addThread,
  closeThreadModal,
}) => {
  const [thread, setThread] = useState([
    { text: firstTweetInThread, media: firstMediaInThread },
  ]);
  const [tweet, setTweet] = useState();
  const [media, setMedia] = useState([]);

  // index of the tweet currently being edited,
  // -1 if no tweet is being edited
  const [currentEditingIndex, setCurrentEditingIndex] = useState(-1);

  const onModalClose = () => {
    closeThreadModal();
  };

  // ADD the tweet to the thread
  const onAddToThread = () => {
    if ((!tweet || tweet.trim() === '') && (media.length === 0)) {
      message.error('Tweet cannot be empty.');
      return;
    }

    // currently editing a thread
    if (currentEditingIndex === -1) {
      const newThread = [...thread, { text: tweet, media: media || [] }];
      setThread(newThread);
      setTweet(null);
    } else {
      const newThread = [...thread];
      newThread[currentEditingIndex] = { text: tweet, media: media || [] };
      setThread(newThread);
      setTweet(null);
      setCurrentEditingIndex(-1);
    }
  };

  // EDIT the tweet in the thread
  const onEditThread = (threadIndex) => {
    setTweet(thread[threadIndex].text);
    setMedia(thread[threadIndex].media || []);
    setCurrentEditingIndex(threadIndex);
  };

  // REMOVE the tweet from the thread
  const onRemoveFromThread = (threadIndex) => {
    setThread((prev) => prev.filter((_, index) => index !== threadIndex));
  };

  // REMOVE media
  const onRemoveMediaFromThread = (removingHash) => {
    const newMedia = media.filter((hash) => hash !== removingHash);
    const newThread = [...thread];
    newThread[currentEditingIndex] = { text: tweet, media: newMedia };
    setMedia(newMedia);
    setThread(newThread);
  };

  // POST the thread to the backend
  const onPostThread = async () => {
    if (thread.some((t) => (t.text || '').trim() === '' && t.media.length === 0)) {
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
      open
      title="Twitter Thread"
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
          Propose thread
        </Button>,
      ]}
    >
      <Row gutter={24}>
        <Col md={12} xs={24}>
          <Input.TextArea
            className="mt-24 mb-12"
            placeholder="Compose your thread..."
            rows={4}
            value={tweet}
            maxLength={MAX_TWEET_LENGTH}
            onChange={(e) => setTweet(e.target.value)}
          />

          <MediaList
            media={media}
            handleDelete={onRemoveMediaFromThread}
          />

          <ProposalCountRow>
            <TweetLength tweet={tweet} />
            <Row className="mt-12" gutter={[8, 8]}>
              <Col>
                <UploadButton
                  type="primary"
                  ghost
                  disabled={media.length === MAX_TWEET_IMAGES}
                  onUploadMedia={(newMedia) => setMedia((prev) => [...prev, newMedia])}
                />
              </Col>
              <Col>
                <Button
                  type="primary"
                  ghost
                  onClick={onAddToThread}
                  disabled={(tweet || '').trim() === '' && media.length === 0}
                >
                  <PlusOutlined />
                  {currentEditingIndex === -1 ? 'Add to thread' : 'Edit thread'}
                </Button>
              </Col>
            </Row>
          </ProposalCountRow>
        </Col>

        <Col
          md={12}
          xs={24}
          style={{ maxHeight: '400px', minHeight: '300px', overflow: 'auto' }}
        >
          <ViewThread
            thread={thread}
            onEditThread={onEditThread}
            onRemoveFromThread={onRemoveFromThread}
          />
        </Col>
      </Row>
    </Modal>
  );
};

ThreadModal.propTypes = {
  firstTweetInThread: PropTypes.string.isRequired,
  firstMediaInThread: PropTypes.arrayOf(PropTypes.string).isRequired,
  closeThreadModal: PropTypes.func.isRequired,
  addThread: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

ThreadModal.defaultProps = {
  isSubmitting: false,
};

export default ThreadModal;
