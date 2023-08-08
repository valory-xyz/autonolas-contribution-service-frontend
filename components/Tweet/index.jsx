import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button, Input, Typography, notification, Row, Col,
} from 'antd/lib';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { uuid } from 'uuidv4';

import { EducationTitle } from 'common-util/Education/EducationTitle';
import Proposals from 'components/Proposals';
import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';

const { Text } = Typography;
const MAX_TWEET_LENGTH = 280;

const SocialPosterContainer = styled.div`
  max-width: 500px;
`;

const Tweet = ({ isAddressPresent }) => {
  const account = useSelector((state) => state?.setup?.account);
  const {
    currentMemoryDetails,
    getUpdatedCentaurAfterTweetProposal,
    updateMemoryWithNewCentaur,
    triggerAction,
  } = useCentaursFunctionalities();

  const [tweet, setTweet] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
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
      notification.error({
        message: `Failed to submit proposal: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !isSubmitting && tweet.length > 0 && account && isAddressPresent;

  return (
    <Row gutter={16}>
      <Col xs={24} md={24} lg={12} xl={12} className="mb-24">
        <SocialPosterContainer>
          <div className="mb-12">
            <EducationTitle
              title="Propose a Tweet"
              educationItem="propose-a-tweet"
            />
          </div>

          <div className="mb-8">
            <Text>Write Tweet</Text>
          </div>
          <Input.TextArea
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            maxLength={MAX_TWEET_LENGTH}
            rows={4}
          />
          <Text type="secondary">{`${tweet.length} / ${MAX_TWEET_LENGTH}`}</Text>

          <div className="mt-12 mb-8">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              loading={isSubmitting}
              type="primary"
            >
              Propose this tweet
            </Button>
          </div>
        </SocialPosterContainer>
      </Col>
      <Col xs={24} md={24} lg={12} xl={12}>
        <Proposals isAddressPresent={isAddressPresent} />
      </Col>
    </Row>
  );
};

Tweet.propTypes = {
  isAddressPresent: PropTypes.bool.isRequired,
};

export default Tweet;