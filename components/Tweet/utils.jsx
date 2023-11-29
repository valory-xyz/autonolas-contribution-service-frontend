import styled from 'styled-components';
import { Typography } from 'antd';
import { MAX_TWEET_LENGTH } from 'util/constants';
import PropTypes from 'prop-types';

export const ProposalCountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const { Text } = Typography;

export const TweetLength = ({ tweet }) => {
  const { length } = tweet || '';
  return <Text type="secondary">{`${length} / ${MAX_TWEET_LENGTH}`}</Text>;
};
TweetLength.propTypes = { tweet: PropTypes.string };
TweetLength.defaultProps = { tweet: '' };

export const getFirstTenChars = (tweetOrThread) => {
  if (typeof tweetOrThread === 'string') {
    return tweetOrThread.substring(0, 10);
  }
  return (tweetOrThread[0] || '').substring(0, 10);
};
