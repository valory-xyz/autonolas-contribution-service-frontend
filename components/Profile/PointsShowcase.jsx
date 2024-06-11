import {
  useEffect, useState, useMemo, useRef, useCallback,
} from 'react';
import Script from 'next/script';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import {
  Card, Spin, Row, Col, Typography,
} from 'antd';
import { shuffleArray } from './utils';

const { Paragraph, Title } = Typography;

const TweetLoader = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 16px 32px;
`;

const StyledCol = styled(Col)`
  max-width: 290px;
`;

const StyledCard = styled(Card)`
  max-width: 282px;
`;

const NoTweetsText = styled(Paragraph)`
  max-width: 400px;
`;

const TweetEmbed = ({
  points, tweetId, isScriptReady, isError, onError,
}) => {
  const isLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const createTweet = useCallback(() => {
    try {
      if (isLoaded.current) return;

      const element = document.getElementById(`tweet-container-${tweetId}`);
      if (!element) return;

      window.twttr.widgets.createTweet(tweetId, element, {
        width: 250,
        cards: 'hidden',
        conversation: 'none',
      });
      isLoaded.current = true;
    } catch {
      onError();
    }
  }, [tweetId]);

  useEffect(() => {
    // Observe changes inside the tweet node,
    // to update loading state in case of success or errors
    const element = document.getElementById(`tweet-container-${tweetId}`);

    // Observer for changes in styles of the iframe
    const iframeObserver = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.target.style.cssText.includes('visibility: visible')) {
          setIsLoading(false);
          iframeObserver.disconnect();
        }
      });
    });

    // Observer for changes in the first child node
    const tweetContainerObserver = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        const tweetContainer = mutation.target.childNodes[0];
        if (tweetContainer && tweetContainer.className.includes('rendered')) {
          // It takes some time to display tweet, iframe in that case gets new styles -
          // we should start tracking iframe instead, to display more accurate loading state
          iframeObserver.observe(tweetContainer.querySelector('iframe'), {
            attributes: true,
            attributeFilter: ['style'],
          });

          // Stop observing once content is added
          tweetContainerObserver.disconnect();
        }
      });
    });

    // Start observing changes in the first child node
    tweetContainerObserver.observe(element, {
      childList: true,
    });

    return () => {
      tweetContainerObserver.disconnect();
      iframeObserver.disconnect();
    };
  }, [tweetId]);

  useEffect(() => {
    if (isScriptReady) {
      createTweet();
    }
  }, [createTweet, isScriptReady]);

  return (
    <StyledCard
      title={`Points earned: ${points}`}
      styles={{ title: { fontSize: '16px' }, body: { padding: '8px 16px' } }}
    >
      <div id={`tweet-container-${tweetId}`} />
      {isLoading && (
        <TweetLoader>
          <Spin size="large" />
        </TweetLoader>
      )}
      {isError && <TweetLoader>Error loading tweet</TweetLoader>}
    </StyledCard>
  );
};

TweetEmbed.propTypes = {
  tweetId: PropTypes.string.isRequired,
  points: PropTypes.number.isRequired,
  isScriptReady: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
};

export const PointsShowcase = ({ tweetIdToPoints }) => {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [isError, setIsError] = useState(false);

  const onError = () => {
    setIsError(true);
  };

  const onReady = () => {
    setIsScriptReady(true);
  };

  const tweets = useMemo(() => {
    const earnedPointsTweets = Object.entries(tweetIdToPoints || {})
      .map(([tweetId, points]) => ({ tweetId, points }))
      .filter(({ points }) => points > 0);

    return shuffleArray(earnedPointsTweets).slice(0, 3);
  }, [tweetIdToPoints]);

  return (
    <>
      <Title level={5} className="mt-24">
        Points Showcase
      </Title>
      {tweets.length > 0 ? (
        <>
          <Paragraph type="secondary">
            Here is a selection of tweets you have made that have earned points.
          </Paragraph>

          <Script
            id="twitter-widgets"
            src="https://platform.twitter.com/widgets.js"
            onReady={onReady}
            onError={onError}
          />

          <Row gutter={[8, 8]} className="mt-12">
            {tweets.map((item) => (
              <StyledCol key={item.tweetId} xs={24} md={8}>
                <TweetEmbed
                  tweetId={item.tweetId}
                  points={item.points}
                  isScriptReady={isScriptReady}
                  isError={isError}
                  onError={onError}
                />
              </StyledCol>
            ))}
          </Row>
        </>
      ) : (
        <NoTweetsText type="secondary" className="mt-12">
          No tweets found. Connect your Twitter account and start completing
          {' '}
          <Link href="/leaderboard">actions</Link>
          {' '}
          to earn more points
        </NoTweetsText>
      )}
    </>
  );
};

PointsShowcase.propTypes = {
  tweetIdToPoints: PropTypes.objectOf(PropTypes.number).isRequired,
};
