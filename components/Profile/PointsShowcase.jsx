import { Col, Row, Typography } from 'antd';
import isEqual from 'lodash/isEqual';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { memo } from 'react';
import styled from 'styled-components';

import { TweetShape } from 'common-util/prop-types';

import { TweetEmbed } from './TweetEmbed';
import { shuffleArray } from './utils';

const MAX_TWEETS_SHOWN = 2;

const { Paragraph, Text } = Typography;

const StyledCol = styled(Col)`
  flex: auto;
  max-width: 306px;
`;
const NoTweetsText = styled(Paragraph)`
  max-width: 400px;
`;

export const PointsShowcase = memo(
  ({ tweetsData }) => {
    const earnedPointsTweets = Object.entries(tweetsData || {})
      .map(([tweetId, tweet]) => ({ tweetId, points: tweet.points }))
      .filter(({ points }) => points > 0);

    const tweets = shuffleArray(earnedPointsTweets).slice(0, MAX_TWEETS_SHOWN);

    return (
      <>
        <Text className="font-weight-600 mt-24" type="secondary">
          Points Showcase
        </Text>
        {tweets.length > 0 ? (
          <>
            <Paragraph type="secondary">
              Here is a selection of tweets you have made that have earned points.
            </Paragraph>

            <Row gutter={[16, 16]} className="mt-12">
              {tweets.map((item) => (
                <StyledCol key={item.tweetId} xs={24} md={8}>
                  <TweetEmbed tweetId={item.tweetId} points={item.points} width={250} />
                </StyledCol>
              ))}
            </Row>
          </>
        ) : (
          <NoTweetsText type="secondary" className="mt-12">
            No tweets found. Connect your Twitter account and start completing{' '}
            <Link href="/leaderboard">actions</Link> to earn more points
          </NoTweetsText>
        )}
      </>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps.tweetsData, nextProps.tweetsData),
);

PointsShowcase.displayName = 'PointsShowcase';
PointsShowcase.propTypes = {
  tweetsData: PropTypes.objectOf(PropTypes.shape(TweetShape)).isRequired,
};
