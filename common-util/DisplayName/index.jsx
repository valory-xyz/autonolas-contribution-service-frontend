import PropTypes from 'prop-types';
import { Typography } from 'antd';

import { CENTAUR_BOT_ADDRESS } from 'util/constants';
import TruncatedEthereumLink from 'common-util/TruncatedEthereumLink';
import { useHelpers } from 'common-util/hooks/useHelpers';

const { Text } = Typography;

const DisplayName = ({ actorAddress, className }) => {
  const { account } = useHelpers();

  if (actorAddress === account) {
    return <Text className={className}>You</Text>;
  }

  if (actorAddress === CENTAUR_BOT_ADDRESS) {
    return <Text className={className}>CentaurBot</Text>;
  }

  return <TruncatedEthereumLink text={actorAddress} className={className} />;
};

DisplayName.propTypes = {
  actorAddress: PropTypes.string,
  className: PropTypes.string,
};

DisplayName.defaultProps = {
  actorAddress: '',
  className: '',
};

export default DisplayName;
