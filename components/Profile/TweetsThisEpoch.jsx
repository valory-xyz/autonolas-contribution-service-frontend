import { TwitterOutlined } from '@ant-design/icons';
import { Col, Flex, Grid, Row, Typography } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TweetShape } from 'common-util/prop-types';

import { TweetEmbed } from './TweetEmbed';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const Scrollable = styled.div`
  max-height: 350px;
  overflow: auto;
`;

const MOBILE_TWEET_WIDTH = 250;
const TWEET_WIDTH = 310;

export const TweetsThisEpoch = ({ tweets }) => {
  const screens = useBreakpoint();
  const isMobile = !!screens.xs;

  const tweetWidth = isMobile ? MOBILE_TWEET_WIDTH : TWEET_WIDTH;
  return tweets.length > 0 ? (
    <Scrollable>
      <Row gutter={[16, 16]} className="mt-12">
        {tweets.map((item) => (
          <Col
            key={item.tweetId}
            xs={24}
            md={12}
            style={{ width: '100%', maxWidth: `${tweetWidth + 50}px` }}
          >
            <TweetEmbed tweetId={item.tweetId} points={item.points} width={tweetWidth} />
          </Col>
        ))}
      </Row>
    </Scrollable>
  ) : (
    <Flex vertical align="center" className="mt-24 mb-24">
      <TwitterOutlined style={{ color: '#A3AEBB', fontSize: 48 }} />
      <Text type="secondary">No tweets this epoch yet.</Text>
      <Text type="secondary">Share something on Twitter!</Text>
    </Flex>
  );
};

TweetsThisEpoch.propTypes = {
  tweets: PropTypes.arrayOf(
    PropTypes.shape({ ...TweetShape, tweetId: PropTypes.string.isRequired }),
  ).isRequired,
};
