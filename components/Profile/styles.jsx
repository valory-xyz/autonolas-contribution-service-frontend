import styled from 'styled-components';
import { Card } from 'antd';

export const IMAGE_SIZE = 250;

export const BadgeCard = styled(Card)`
  .ant-card-body {
    padding: 0;
  }
  .ant-skeleton {
    width: ${IMAGE_SIZE}px;
    height: ${IMAGE_SIZE}px;
    padding: 24px;
  }
`;
