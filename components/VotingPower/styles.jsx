import styled from 'styled-components';
import { COLOR } from '@autonolas/frontend-library';
import { Menu } from 'antd';

export const VerticalDivider = styled.div`
    height: 40px;
    width: 1px;
    background-color: ${COLOR.BORDER_GREY};
    margin: 0 4px 0 12px;
`;

export const StyledMenu = styled(Menu)`
  width: 265px;
`;
