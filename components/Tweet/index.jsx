import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button, Input, Typography, notification, Row, Col,
} from 'antd/lib';
import styled from 'styled-components';
import { uuid } from 'uuidv4';
import { PlusCircleOutlined } from '@ant-design/icons';

import { EducationTitle } from 'common-util/Education/EducationTitle';
import { notifyError } from 'common-util/functions';

import Proposals from '../Proposals';
import { checkIfHas100kVeOlas } from '../MembersList/requests';
import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';
import ThreadModal from './ThreadModal';

const { Text } = Typography;
const MAX_TWEET_LENGTH = 280;

const SocialPosterContainer = styled.div`
  max-width: 500px;
`;

const ProposalCountRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Tweet = () => {
  const {
    currentMemoryDetails,
    getUpdatedCentaurAfterTweetProposal,
    updateMemoryWithNewCentaur,
    triggerAction,
    isAddressPresent,
  } = useCentaursFunctionalities();
  const account = useSelector((state) => state?.setup?.account);

  const [tweet, setTweet] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThreadModalVisible, setIsThreadModalVisible] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const has100kVeOlas = await checkIfHas100kVeOlas({ account });
      if (!has100kVeOlas) {
        throw new Error(
          'You must hold at least 100k veOLAS to propose a tweet.',
        );
      }

      const tweetDetails = {
        request_id: uuid(),
        text: tweet,
        voters: [], // initially no votes
        posted: false,
        proposer: account,
        createdDate: Date.now() / 1000, // in seconds
        execute: false,
        action_id: '',
      };

      const updatedCentaur = getUpdatedCentaurAfterTweetProposal(
        tweetDetails,
        currentMemoryDetails,
      );

      // Update the Ceramic stream
      const commitId = await updateMemoryWithNewCentaur(updatedCentaur);

      // Add action to the centaur
      const action = {
        actorAddress: account,
        commitId,
        description: 'proposed a tweet',
        timestamp: Date.now(),
      };
      await triggerAction(currentMemoryDetails.id, action);
      notification.success({ message: 'Tweet proposed' });

      // reset form
      setTweet('');
    } catch (error) {
      notifyError(`Proposal failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeThreadModal = () => {
    setIsThreadModalVisible(false);
  };

  const canSubmit = !isSubmitting && tweet.length > 0 && account && isAddressPresent;

  return (
    <Row gutter={16}>
      <Col xs={24} md={24} lg={12} xl={8} className="mb-24">
        <SocialPosterContainer>
          <EducationTitle title="Tweet" educationItem="tweet" />

          <Input.TextArea
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            maxLength={MAX_TWEET_LENGTH}
            rows={4}
            className="mt-24 mb-12"
          />

          <ProposalCountRow>
            <Text type="secondary">{`${tweet.length} / ${MAX_TWEET_LENGTH}`}</Text>
            <Button
              type="primary"
              ghost
              size="small"
              onClick={() => setIsThreadModalVisible(true)}
            >
              <PlusCircleOutlined />
              &nbsp;Add
            </Button>
            {isThreadModalVisible && <ThreadModal closeThreadModal={closeThreadModal} />}
          </ProposalCountRow>

          <Button
            className="mt-12 mb-8"
            onClick={handleSubmit}
            disabled={!canSubmit}
            loading={isSubmitting}
            type="primary"
          >
            Propose
          </Button>
        </SocialPosterContainer>
      </Col>

      <Col xs={24} md={24} lg={12} xl={12}>
        <Proposals isAddressPresent={isAddressPresent} />
      </Col>
    </Row>
  );
};

export default Tweet;
