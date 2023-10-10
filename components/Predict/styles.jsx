import styled from 'styled-components';
import { COLOR } from '@autonolas/frontend-library';
import { Alert } from 'antd/lib';

export const ProcessingBanner = styled(Alert)`
  background-color: ${COLOR.WHITE};
  border: 1px solid ${COLOR.GREY_1};
  border-radius: 5px;
  padding: 20px;
`;
