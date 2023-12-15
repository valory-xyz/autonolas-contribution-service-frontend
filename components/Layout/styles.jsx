import styled from 'styled-components';
import { Layout, Menu } from 'antd';
import { COLOR, MEDIA_QUERY } from '@autonolas/frontend-library';

export const CustomLayout = styled(Layout)`
  background: ${COLOR.GREY_3};
  /* filter: invert(0.95) hue-rotate(39deg); // uncomment this line for dark mode */
  .site-layout {
    padding: ${({ ispadded }) => (ispadded === 'true' ? '0' : ' 0 20px 100px 20px;')};
    margin-top: 64px;
    .contribute-footer {
      > div {
        height: 100px;
        align-items: center;
        padding-left: 0;
        padding-right: 0;
      }
    }
    .site-layout-background {
      padding: ${({ ispadded }) => (ispadded === 'true' ? '0' : '24px 0;')};
      min-height: calc(100vh - 120px);
    }
  }

  .ant-list-item.bot-chat {
    text-align: right;
    background-color: ${COLOR.GREY_3};
    border-bottom: 1px solid ${COLOR.GREY_1};
    .ant-list-item-meta-content {
      padding: 0 1rem;
    }
  }

  ${MEDIA_QUERY.mobileL} {
    .show-only-sm {
      display: initial;
    }
    .hide-only-sm {
      display: none;
    }
  }

  ${MEDIA_QUERY.mobileM} {
    .site-layout {
      padding: 0 20px;
    }
    .site-layout-background {
      padding: 8px 0;
    }
  }
`;

export const Logo = styled.div`
  width: 175px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-right: 1rem;
  span {
    margin-left: 0.5rem;
  }
`;

export const RightMenu = styled.div`
  display: flex;
  align-items: center;

  ${MEDIA_QUERY.tablet} {
    line-height: normal;
  }
`;

export const SupportOnlyDesktop = styled.div`
  margin: 4rem 0;
`;

export const NextUpdateTimer = styled.div`
  display: inline-flex;
  align-items: center;
  .ant-statistic {
    color: inherit;
  }
  .ant-statistic-content {
    font-weight: inherit;
    font-size: inherit;
    color: inherit;
  }
`;

export const CustomHeader = styled(Layout.Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${COLOR.WHITE};
  border-bottom: 1px solid ${COLOR.BORDER_GREY};
`;

export const CustomMenu = styled(Menu)`
  position: fixed;
  top: 64px;
  bottom: 0;
  left: 0;
  width: 200px;
  border-right: 1px solid ${COLOR.BORDER_GREY} !important;
  z-index: 2;
  li {
    line-height: 40px;
    height: 40px;
  }
`;
