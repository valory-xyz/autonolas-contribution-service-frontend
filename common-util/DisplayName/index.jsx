import PropTypes from 'prop-types';
import Link from 'next/link';

import { truncateAddress } from 'common-util/functions';

const DisplayName = ({ actorAddress, account }) => {
  const truncatedAddress = truncateAddress(actorAddress);

  return (
    <Link href={`/profile/${actorAddress}`}>
      {actorAddress?.toLowerCase() === account?.toLowerCase() ? 'You' : truncatedAddress}
    </Link>
  );
};

DisplayName.propTypes = {
  account: PropTypes.string,
  actorAddress: PropTypes.string.isRequired,
};

DisplayName.defaultProps = {
  account: '',
};

export default DisplayName;
