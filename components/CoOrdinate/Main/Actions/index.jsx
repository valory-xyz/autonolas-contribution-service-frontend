import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Timeline, Card } from 'antd/lib';
import Moment from 'react-moment';
import DisplayName from 'common-util/DisplayName';

const { Title, Text } = Typography;

function convertTimestampsToMilliseconds(actions) {
  for (let i = 0; i < actions.length; i += 1) {
    const action = actions[i];
    const { timestamp } = action;

    // Check if the timestamp is in seconds
    if (timestamp < 10 ** 12) {
      // Convert seconds to milliseconds
      action.timestamp = timestamp * 1000;
    }
  }

  return actions;
}

const Actions = ({ actions, account }) => {
  if (!actions || actions.length === 0) {
    return <Text type="secondary">No actions recorded</Text>;
  }

  const convertedActions = convertTimestampsToMilliseconds(actions);
  const sortedActions = convertedActions.sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  return (
    <Card title={<Title level={4}>Activity</Title>}>
      <div className="actions-card-body">
        <Timeline>
          {sortedActions.map((action, index) => (
            <Timeline.Item key={`${action.timestamp}-${index}`}>
              <DisplayName actorAddress={action.actorAddress} account={account} />
              {' '}
              {action.description}
              <br />
              <Text type="secondary">
                <Moment unix fromNow>
                  {action.timestamp / 1000}
                </Moment>
              </Text>
              {action.outputUrl && (
                <Text type="secondary">
                  &nbsp;
                  –
                  &nbsp;
                  <a
                    href={action.outputUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    see output
                  </a>
                </Text>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </Card>
  );
};

Actions.propTypes = {
  account: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      actorAddress: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      timestamp: PropTypes.number.isRequired,
    }),
  ),
};

Actions.defaultProps = {
  account: null,
  actions: [],
};

export default Actions;
