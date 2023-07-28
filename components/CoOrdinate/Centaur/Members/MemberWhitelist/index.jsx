import React from 'react';
import PropTypes from 'prop-types';
import { Card, List, Typography } from 'antd/lib';
import DisplayName from 'common-util/DisplayName';

const { Title } = Typography;

const MemberWhitelist = ({ members }) => {
  const uniqueMembers = Array.from(new Set(members));

  return (
    <Card
      title={<Title level={4}>Member Whitelist</Title>}
      bodyStyle={{ padding: 0 }}
    >
      <List
        size="large"
        locale={{ emptyText: 'No whitelist' }}
        dataSource={uniqueMembers}
        renderItem={(member) => (
          <List.Item key={member}>
            <DisplayName actorAddress={member} />
          </List.Item>
        )}
      />
    </Card>
  );
};

MemberWhitelist.propTypes = {
  members: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default MemberWhitelist;
