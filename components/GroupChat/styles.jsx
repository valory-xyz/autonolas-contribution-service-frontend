import { Card } from 'antd/lib';
import styled from 'styled-components';

export const GroupChatContainer = styled(Card)`
  position: relative;
  height: 100%;
  .group-chat-container {
    height: calc(100vh - 386px);
    overflow: auto;
  }
`;

export const StyledGroupChat = styled.div`
  padding: 1rem 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  display: block;
`;
