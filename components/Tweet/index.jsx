import { useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useSignMessage } from 'wagmi';
import { v4 as uuid } from 'uuid';
import {
  Button, Input, notification, Row, Col, Typography,
} from 'antd';
import styled from 'styled-components';
import { PlusCircleOutlined } from '@ant-design/icons';
import { notifyError } from '@autonolas/frontend-library';

import { HUNDRED_K_OLAS, MAX_TWEET_LENGTH } from 'util/constants';
import { EducationTitle } from 'common-util/Education/EducationTitle';
import { useHelpers } from 'common-util/hooks/useHelpers';
import { Proposals } from './Proposals';
import { checkVeolasThreshold } from '../MembersList/requests';
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

export const Tweet = () => {
  const { signMessageAsync } = useSignMessage();
  const { isStaging } = useHelpers();
  const {
    currentMemoryDetails,
    getUpdatedCentaurAfterTweetProposal,
    updateMemoryWithNewCentaur,
    triggerAction,
  } = useCentaursFunctionalities();
  const account = useSelector((state) => state?.setup?.account);

  const [tweet, setTweet] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThreadModalVisible, setIsThreadModalVisible] = useState(false);

  const handleSubmit = async (tweetOrThread) => {
    setIsSubmitting(true);

    try {
      const has100kVeOlas = await checkVeolasThreshold(account, HUNDRED_K_OLAS);
      if (!isStaging && !has100kVeOlas) {
        notifyError('You must hold at least 100k veOLAS to propose a tweet.');
        return;
      }

      const signature = await signMessageAsync({
        message: `I am signing a message to verify that I propose a tweet starting with ${getFirstTenCharsOfTweet(
          tweetOrThread,
        )}...`,
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
      await triggerAction(currentMemoryDetails.id, action);
      notification.success({ message: 'Tweet proposed' });

      // reset form
      setTweet('');
    } catch (error) {
      notifyError('Tweet proposal failed');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeThreadModal = () => {
    setIsThreadModalVisible(false);
  };

  const canSubmit = !isSubmitting && tweet.length > 0 && account;

  return (
    <Row gutter={16}>
      <Col xs={24} md={24} lg={16} className="mb-24">
        <SocialPosterContainer>
          <EducationTitle title="Tweet" educationItem="tweet" />

          <TextArea
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
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
          <Text type="secondary">
            To propose a tweet, you must
            {' '}
            <Link href="/members">join Contribute</Link>
            {' '}
            and hold at least 100k
            veOLAS.
          </Text>
        </SocialPosterContainer>
      </Col>

      <Col xs={24} md={24} lg={24}>
        <Proposals />
      </Col>
    </Row>
  );
};
