import Link from 'next/link';
import PropTypes from 'prop-types';

export const DiscordLink = ({ text }) => (
  <Link href="/verification">{text || 'Complete Discord verification'}</Link>
);

DiscordLink.propTypes = {
  text: PropTypes.string,
};

DiscordLink.defaultProps = {
  text: null,
};
