import PropTypes from 'prop-types';
import Link from 'next/link';
import { EllipsisMiddle } from '@autonolas/frontend-library';

const DisplayName = ({ actorAddress, account }) => (
  <Link href={`/profile/${actorAddress}`}>
    {actorAddress?.toLowerCase() === account?.toLowerCase() ? 'You' : <EllipsisMiddle>{actorAddress}</EllipsisMiddle>}
  </Link>
);

DisplayName.propTypes = {
  account: PropTypes.string,
  actorAddress: PropTypes.string.isRequired,
};

DisplayName.defaultProps = {
  account: '',
};

export default DisplayName;
