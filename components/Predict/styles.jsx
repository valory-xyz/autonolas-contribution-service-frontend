import styled from 'styled-components';
import { COLOR } from '@autonolas/frontend-library';
import { Alert } from 'antd/lib';

export const ProcessingBanner = styled(Alert)`
  background-color: ${COLOR.WHITE};
  border-radius: 5px;
  padding: 20px;
`;
