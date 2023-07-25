import styled from 'styled-components';

export const GroupChatContainer = styled.div`
  position: relative;
  height: 100%;
  .group-chat-container {
    height: calc(100vh - 286px);
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
