import PropTypes from 'prop-types';

export const DiscordLink = ({ text }) => (
  <a href="https://discord.gg/4xhAHuy4Y3" target="_blank" rel="noreferrer">
    {text || 'Link your Discord'}
  </a>
);

DiscordLink.propTypes = {
  text: PropTypes.string,
};

DiscordLink.defaultProps = {
  text: null,
};
