import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { MAX_TWEET_LENGTH } from 'util/constants';

const { Text } = Typography;

const TweetLength = ({ tweet }) => {
  const { length } = tweet || '';
  return <Text type="secondary">{`${length} / ${MAX_TWEET_LENGTH}`}</Text>;
};

TweetLength.propTypes = { tweet: PropTypes.string };
TweetLength.defaultProps = { tweet: '' };

export default TweetLength;
