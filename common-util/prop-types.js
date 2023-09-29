import PropTypes from 'prop-types';

export const ProposalPropTypes = PropTypes.shape({
  request_id: PropTypes.string.isRequired,
  // tweet = the `text` is string
  // thread = the `text` is array of string (array of tweets)
  text: PropTypes.oneOfType(
    [PropTypes.string, PropTypes.arrayOf(PropTypes.string)],
  ).isRequired,
  voters: PropTypes.oneOfType(
    [
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.shape({ address: PropTypes.string.isRequired }),
    ],
  ),
  posted: PropTypes.bool.isRequired,
  proposer: PropTypes.string.isRequired,
});

export const ProposalsPropTypes = PropTypes.arrayOf(ProposalPropTypes);

export const MembersPropTypes = PropTypes.shape({
  address: PropTypes.string.isRequired,
  ownership: PropTypes.number.isRequired,
});

export const MessagesPropTypes = PropTypes.shape({
  member: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
});

export const ActionsPropTypes = PropTypes.shape({
  commitId: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  actorAddress: PropTypes.string.isRequired,
});

export const CentaurPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  memory: PropTypes.arrayOf(PropTypes.string),
  members: PropTypes.arrayOf(MembersPropTypes),
  purpose: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    public_chat: PropTypes.bool,
  }),
  messages: PropTypes.arrayOf(MessagesPropTypes),
  actions: PropTypes.arrayOf(ActionsPropTypes),
  plugins_data: PropTypes.shape({
    daily_orbis: PropTypes.shape({}),
    daily_tweet: PropTypes.shape({}),
    scheduled_tweet: PropTypes.shape({
      tweets: ProposalsPropTypes,
    }),
  }),

  configuration: PropTypes.shape({
    memberWhitelist: PropTypes.arrayOf(PropTypes.string),
  }),
});
