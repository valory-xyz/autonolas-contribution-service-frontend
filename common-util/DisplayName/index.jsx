import PropTypes from 'prop-types';
import { Typography } from 'antd';

import { CENTAUR_BOT_ADDRESS } from 'util/constants';
import TruncatedEthereumLink from 'common-util/TruncatedEthereumLink';

const { Text } = Typography;

const DisplayName = ({ actorAddress, account, className }) => {
  if (actorAddress === account) {
    return <Text className={className}>You</Text>;
  }

  if (actorAddress === CENTAUR_BOT_ADDRESS) {
    return <Text className={className}>CentaurBot</Text>;
  }

  return <TruncatedEthereumLink text={actorAddress} className={className} />;
};

DisplayName.propTypes = {
  account: PropTypes.string,
  actorAddress: PropTypes.string.isRequired,
  className: PropTypes.string,
};

DisplayName.defaultProps = {
  account: null,
  className: '',
};

export default DisplayName;
