import { MessageTwoTone } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

export const GroupChatContainer = styled(Card)`
  border-radius: 0;
  height: calc(100vh - 64px);
  border-radius: 0;
  height: calc(100vh - 64px);
  .group-chat-container {
    height: calc(100vh - 190px);
    height: calc(100vh - 190px);
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

export const MessageGroup = styled.div`
  margin-bottom: 16px;
`;

export const MessageContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const MessageBody = styled(Text)`
  margin-right: 8px;
  line-height: 1.3;
`;

export const MessageTimestamp = styled(Text)`
  min-width: 50px;
  text-align: right;
`;

export const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20vh;
  text-align: center;
`;

export const StyledMessageTwoTone = styled(MessageTwoTone)`
  font-size: 4rem;
  margin-bottom: 16px;
`;
