import {
  useEffect, useState, useRef, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  Card, Spin, Row, Col, Typography,
} from 'antd';
import { useScript } from './hooks';
import { shuffleArray } from './utils';

const { Paragraph, Title } = Typography;

const TweetEmbed = ({ points, tweetId }) => {
  const isLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const status = useScript('https://platform.twitter.com/widgets.js');

  useEffect(() => {
    if (status !== 'ready') return;
    if (isLoaded.current) return;

    window.twttr.widgets.createTweet(tweetId, document.getElementById(`tweet-container-${tweetId}`), { cards: 'hidden' })
      .finally(() => {
        // TODO: nadle errors
        setIsLoading(false);
      });

    isLoaded.current = true;
  }, [isLoading, status, tweetId]);

  return (
    <Card title={`Points earned: ${points}`} style={{ maxWidth: 400, marginBottom: 16 }}>
      <div id={`tweet-container-${tweetId}`} />
      {isLoading && <div style={{ display: 'flex', justifyContent: 'center', margin: 8 }}><Spin size="large" /></div>}
    </Card>
  );
};

TweetEmbed.propTypes = {
  tweetId: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
};

const PointsShowcase = ({ tweetIdToPoints }) => {
  const tweets = useMemo(
    () => {
      const earnedPointsTweets = Object.entries(tweetIdToPoints)
        .reduce((acc, [key, value]) => {
          if (value > 0) {
            acc.push({ tweetId: key, points: value });
          }
          return acc;
        }, []);

      return shuffleArray(earnedPointsTweets).slice(0, 3);
    },
    [tweetIdToPoints],
  );

  return (
    <>
      <Title level={5} className="mt-12">Points Showcase</Title>
      <div />
      <Paragraph type="secondary">Here is a selection of tweets you have made that have earned points.</Paragraph>
      <Row gutter={[16, 16]} className="mt-12">
        {tweets.map((item) => (
          <Col key={item.tweetId} xs={24} md={12}>
            <TweetEmbed
              tweetId={item.tweetId}
              points={item.points}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

PointsShowcase.propTypes = {
  tweetIdToPoints: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default PointsShowcase;
