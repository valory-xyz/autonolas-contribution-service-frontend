import React from 'react';
import { Divider } from 'antd';
import { useSelector } from 'react-redux';
import { MessageGroupContainer } from './MessageGroupContainer';

export const MessageGroups = ({ messages }) => {
  const account = useSelector((state) => state?.setup?.account);

  return messages.map(([dateKey, messageGroups]) => {
    const isToday = new Date().toISOString().split('T')[0] === dateKey;

    const dateDivider = messageGroups.length > 0 ? (
      <div className="date-segment">
        <Divider plain>
          {isToday ? 'Today' : new Date(dateKey).toLocaleDateString()}
        </Divider>
      </div>
    ) : null;

    return (
      <div key={dateKey}>
        {dateDivider}
        {messageGroups.map(({ address, messages: groupedMessages }) => {
          const { username } = (groupedMessages?.length > 0
              && groupedMessages[0].creator_details?.profile)
            || {};
          return (
            <MessageGroupContainer
              dateKey={dateKey}
              address={address}
              account={account}
              username={username}
              groupedMessages={groupedMessages}
            />
          );
        })}
      </div>
    );
  });
};
