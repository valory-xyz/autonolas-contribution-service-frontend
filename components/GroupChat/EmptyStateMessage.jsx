import React from 'react';
import { Typography } from 'antd';
import { COLOR } from '@autonolas/frontend-library';

import { EmptyState, StyledMessageTwoTone } from './styles';

const { Text } = Typography;

// TODO refactor to use antd's native Result component
export const EmptyStateMessage = () => {
  <EmptyState>
    <div>
      <StyledMessageTwoTone twoToneColor={COLOR.GREY_1} />
      <br />
      <Text type="secondary">To start chatting, select a chat</Text>
    </div>
  </EmptyState>;
};
