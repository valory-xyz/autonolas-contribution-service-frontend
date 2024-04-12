import {
  useEffect, useState, useRef, useMemo,
} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Card, Spin, Row, Col, Typography,
} from 'antd';
import { useScript } from './hooks';
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

const TweetEmbed = ({ points, tweetId }) => {
  const tweetLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const status = useScript('https://platform.twitter.com/widgets.js');

  useEffect(() => {
    const handleTweetLoad = () => {
      setIsLoading(false);
      tweetLoaded.current = true;
    };

    const loadTweetEmbedded = () => {
      if (status !== 'ready') return;
      if (tweetLoaded.current) return;

      window.twttr.widgets.createTweet(
        tweetId,
        document.getElementById(`tweet-container-${tweetId}`),
        { width: 250, cards: 'hidden', conversation: 'none' },
      );
      tweetLoaded.current = true;
    };

    // Observe changes inside the tweet node,
    // to update loading state in case of success or errors
    const element = document.getElementById(`tweet-container-${tweetId}`);
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList' && element.childNodes.length > 0) {
          handleTweetLoad();
          observer.disconnect(); // Stop observing once content is added
        }
      });
    });

    observer.observe(element, { childList: true });

    loadTweetEmbedded();

    return () => {
      observer.disconnect();
    };
  }, [isLoading, status, tweetId]);

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
    </StyledCard>
  );
};

TweetEmbed.propTypes = {
  tweetId: PropTypes.string.isRequired,
  points: PropTypes.number.isRequired,
};

const PointsShowcase = ({ tweetIdToPoints }) => {
  const tweets = useMemo(() => {
    const earnedPointsTweets = Object.entries(tweetIdToPoints).reduce(
      (acc, [key, value]) => {
        if (value > 0) {
          acc.push({ tweetId: key, points: value });
        }
        return acc;
      },
      [],
    );

    return shuffleArray(earnedPointsTweets).slice(0, 3);
  }, [tweetIdToPoints]);

  return (
    <>
      <Title level={5} className="mt-24">
        Points Showcase
      </Title>
      <Paragraph type="secondary">
        Here is a selection of tweets you have made that have earned points.
      </Paragraph>
      <Row gutter={[8, 8]} className="mt-12">
        {tweets.length > 0 ? (
          tweets.map((item) => (
            <StyledCol key={item.tweetId} xs={24} md={8}>
              <TweetEmbed tweetId={item.tweetId} points={item.points} />
            </StyledCol>
          ))
        ) : (
          <div />
        )}
      </Row>
    </>
  );
};

PointsShowcase.propTypes = {
  tweetIdToPoints: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default PointsShowcase;
