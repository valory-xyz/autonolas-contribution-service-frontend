import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { List } from 'antd';
import PropTypes from 'prop-types';
import { areAddressesEqual } from '@autonolas/frontend-library';

export const Conversations = ({ isLoading, messages }) => {
  const account = useSelector((state) => state?.setup?.account);

  useEffect(() => {
    if (document) {
      const listDiv = document.getElementById('conversations-list');
      if (listDiv) {
        listDiv.scrollTop = listDiv.scrollHeight;
      }
    }
  }, [(messages || []).length]);

  return (
    <List
      id="conversations-list"
      loading={isLoading}
      dataSource={(messages || [])
        .filter((e) => e.role !== 'system')
        .map((e) => {
          if (areAddressesEqual(e.address, account)) {
            return { ...e, role: 'You' };
          }
          return { ...e, role: 'Member' };
        })}
      renderItem={(item) => (
        <List.Item
          className={areAddressesEqual(item.address, account) ? 'bot-chat' : ''}
        >
          <List.Item.Meta title={item.role} description={item.message}>
            {item.message}
          </List.Item.Meta>
        </List.Item>
      )}
    />
  );
};

Conversations.propTypes = {
  isLoading: PropTypes.bool,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string,
      message: PropTypes.string,
    }),
  ),
};

Conversations.defaultProps = {
  isLoading: false,
  messages: [],
};
