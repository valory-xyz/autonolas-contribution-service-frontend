import { COLOR } from '@autonolas/frontend-library';
import { Card } from 'antd';
import styled from 'styled-components';

export const GroupChatContainer = styled(Card)`
  border-radius: 0;
  height: calc(100vh - 64px);
  .group-chat-container {
    height: calc(100vh - 190px);
    overflow: auto;
    margin-bottom: 56px;
  }
`;

export const StyledGroupChat = styled.div`
  border-top: 1px solid ${COLOR.BORDER_GREY};
  position: absolute;
  bottom: 0;
  display: block;
  width: 100%;
  padding: 1rem 0;
`;

export const MessageGroup = styled.div`
  margin-bottom: 16px;
`;
