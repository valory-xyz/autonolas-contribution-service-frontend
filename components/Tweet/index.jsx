import { useState, useCallback } from 'react';
import { useSignMessage } from 'wagmi';
import { v4 as uuid } from 'uuid';
import {
  Button, Input, Row, Col, Typography,
} from 'antd';
import styled from 'styled-components';
import { PlusCircleOutlined } from '@ant-design/icons';
import { notifyError, notifySuccess } from '@autonolas/frontend-library';

import { HUNDRED_K_OLAS_IN_WEI, MAX_TWEET_LENGTH } from 'util/constants';
import { EducationTitle } from 'common-util/Education/EducationTitle';
import { useHelpers } from 'common-util/hooks/useHelpers';
import { Proposals } from './Proposals';
import { checkVotingPower } from '../MembersList/requests';
import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';
import {
  TweetLength,
  ProposalCountRow,
  getFirstTenCharsOfTweet,
} from './utils';
import ThreadModal from './ThreadModal';

const { Text } = Typography;
const { TextArea } = Input;

const SocialPosterContainer = styled.div`
  max-width: 500px;
`;

const ToProposeTweetText = () => (
  <Text type="secondary">
    To propose a tweet, you must have at least 100k veOLAS voting power.
  </Text>
);

export const TweetPropose = () => {
  const { signMessageAsync } = useSignMessage();
  const { isStaging, account } = useHelpers();
  const {
    currentMemoryDetails,
    getUpdatedCentaurAfterTweetProposal,
    updateMemoryWithNewCentaur,
    triggerAction,
    fetchUpdatedMemory,
  } = useCentaursFunctionalities();

  const [tweet, setTweet] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThreadModalVisible, setIsThreadModalVisible] = useState(false);

  const handleSubmit = async (tweetOrThread) => {
    setIsSubmitting(true);

    try {
      const has100kVotingPower = await checkVotingPower(
        account,
        HUNDRED_K_OLAS_IN_WEI,
      );

      if (!isStaging && !has100kVotingPower) {
        notifyError('You must have at least 100k veOLAS voting power to propose a tweet.');
        return;
      }

      const signature = await signMessageAsync({
        message: `I am signing a message to verify that I propose a tweet starting with ${getFirstTenCharsOfTweet(
          tweetOrThread,
        )}`,
      });

      const tweetDetails = {
        request_id: uuid(),
        createdDate: Date.now() / 1000, // in seconds
        text: tweetOrThread,
        posted: false,
        proposer: { address: account, signature, verified: null },
        voters: [], // initially no votes
        executionAttempts: [], // initially no execution attempts
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

      const updatedMemoryDetails = await fetchUpdatedMemory();
      await triggerAction(
        currentMemoryDetails.id,
        action,
        updatedMemoryDetails,
      );
      notifySuccess('Tweet proposed');

      // reset form
      setTweet('');
    } catch (error) {
      notifyError('Tweet proposal failed');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onTweetChange = useCallback((event) => {
    setTweet(event.target.value);
  }, []);

  const closeThreadModal = () => {
    setIsThreadModalVisible(false);
  };

  const canSubmit = !isSubmitting && tweet?.length > 0 && account;

  return (
    <SocialPosterContainer>
      <EducationTitle title="Tweet" educationItem="tweet" />

      <TextArea
        value={tweet}
        onChange={onTweetChange}
        maxLength={MAX_TWEET_LENGTH}
        rows={4}
        className="mt-24 mb-12"
      />

      <ProposalCountRow>
        <TweetLength tweet={tweet} />
        <Button
          type="link"
          disabled={!canSubmit}
          onClick={() => setIsThreadModalVisible(true)}
        >
          <PlusCircleOutlined />
          &nbsp;Start thread
        </Button>
        {isThreadModalVisible && (
          <ThreadModal
            firstTweetInThread={tweet}
            isSubmitting={isSubmitting}
            closeThreadModal={closeThreadModal}
            addThread={handleSubmit}
          />
        )}
      </ProposalCountRow>

      <Button
        className="mt-12 mb-12"
        type="primary"
        disabled={!canSubmit}
        loading={isSubmitting && !isThreadModalVisible}
        onClick={() => handleSubmit(tweet)}
      >
        Propose
      </Button>
      <br />
      <ToProposeTweetText />
    </SocialPosterContainer>
  );
};

export const Tweet = () => (
  <Row gutter={16}>
    <Col xs={24} md={24} lg={16} className="mb-24">
      <TweetPropose />
    </Col>

    <Col xs={24} md={24} lg={24}>
      <Proposals />
    </Col>
  </Row>
);
