import { ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Spin, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import styled from 'styled-components';

const { Text } = Typography;

const TweetPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin: 16px;
  min-height: 120px;
`;

const StyledCard = styled(Card)`
  width: 100%;
`;

export const TweetEmbed = ({ points, tweetId, width = 250 }) => {
  const [isError, setIsError] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  const handleReload = () => {
    // Toggle isMounted state so that TwitterTweetEmbed
    // component is mounted again nad can be reloaded
    setIsMounted(false);
    setTimeout(() => setIsMounted(true));
    setIsError(false);
  };

  return (
    <StyledCard
      title={`Points earned: ${points}`}
      style={{ maxWidth: `${width + 32}px` }}
      styles={{
        title: { fontSize: '16px' },
        body: { padding: '8px 16px' },
      }}
    >
      {isError && (
        <TweetPlaceholder>
          <Text className="block">Error loading tweet</Text>
          <Button onClick={handleReload} icon={<ReloadOutlined />} type="text" />
        </TweetPlaceholder>
      )}
      {isMounted && (
        <TwitterTweetEmbed
          tweetId={`${tweetId}`}
          options={{
            width,
            cards: 'hidden',
            conversation: 'none',
          }}
          onLoad={(element) => {
            if (!element) {
              setIsError(true);
            }
          }}
          placeholder={
            <TweetPlaceholder>
              <Spin size="large" />
            </TweetPlaceholder>
          }
        />
      )}
    </StyledCard>
  );
};

TweetEmbed.propTypes = {
  tweetId: PropTypes.string.isRequired,
  points: PropTypes.number.isRequired,
  width: PropTypes.number,
};

TweetEmbed.defaultValues = {
  width: 250,
};
