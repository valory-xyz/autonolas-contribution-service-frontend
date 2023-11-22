import { Card } from 'antd';
import styled from 'styled-components';

export const GroupChatContainer = styled(Card)`
  position: relative;
  .group-chat-container {
    height: calc(100vh - 330px);
    overflow: auto;
    margin-bottom: 56px;
  }
`;

export const StyledGroupChat = styled.div`
  position: absolute;
  bottom: 0;
  display: block;
  width: 100%;
  padding: 1rem 0;
`;
