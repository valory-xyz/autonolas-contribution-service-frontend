import styled from 'styled-components';

import { COLOR } from '@autonolas/frontend-library';

export const Cell = styled.div`
  line-height: 1;

  .cell-text {
    color: ${COLOR.PRIMARY};
    font-size: 12px !important;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
