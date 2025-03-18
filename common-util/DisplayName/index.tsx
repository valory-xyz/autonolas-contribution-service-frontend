import Link from 'next/link';
import PropTypes from 'prop-types';

import { truncateAddress } from 'common-util/functions';

const DisplayName = ({ actorAddress, username }: { actorAddress: string; username: string }) => (
  <Link href={`/profile/${actorAddress}`}>{username || truncateAddress(actorAddress)}</Link>
);

DisplayName.propTypes = {
  actorAddress: PropTypes.string.isRequired,
  username: PropTypes.string,
};

DisplayName.defaultProps = {
  username: '',
};

export default DisplayName;
