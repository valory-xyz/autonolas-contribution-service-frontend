import styled, { createGlobalStyle } from 'styled-components';
import { COLOR, MEDIA_QUERY } from '@autonolas/frontend-library';

// const GlobalStyles = styled.div`
const GlobalStyle = createGlobalStyle`
  *,
  :after,
  :before {
    box-sizing: border-box;
  }

  /* common */
  .m-0 {
    margin: 0 !important;
  }

  .mb-0 {
    margin-bottom: 0px !important;
  }

  .mb-2 {
    margin-bottom: 2px !important;
  }

  .mb-4 {
    margin-bottom: 4px !important;
  }

  .mb-8 {
    margin-bottom: 8px !important;
  }

  .mb-12 {
    margin-bottom: 12px;
  }

  .mb-16 {
    margin-bottom: 16px;
  }

  .mb-24 {
    margin-bottom: 24px !important;
  }

  .mb-48 {
    margin-bottom: 48px !important;
  }

  .mr-12 {
    margin-right: 12px !important;
  }

  .mr-48 {
    margin-right: 48px !important;
  }

  .mt-8 {
    margin-top: 8px;
  }
  .mt-12 {
    margin-top: 12px;
  }
  
  .walletconnect-modal__base {
    .walletconnect-modal__mobile__toggle a {
      color: #1890ff !important;
    }
  }
  .ant-alert {
    border-radius: 5px;
  }
  .show-only-sm {
    display: none;
  }
  .hide-only-sm {
    display: initial;
  }

  /* layout */
  .ant-layout {
    background: ${COLOR.WHITE};
  }
  .ant-layout-header {
    display: flex;
    position: fixed;
    z-index: 10;
    width: 100%;
    .ant-menu {
      flex: 1;
      &.ant-menu-horizontal {
        border: none;
      }
      &.ant-menu-horizontal > .ant-menu-item::after,
      .ant-menu-horizontal > .ant-menu-submenu::after {
        border-bottom: none !important;
      }
      .ant-menu-item-selected {
        font-weight: bold;
      }
    }
  }
  .ant-layout-footer {
    text-align: center;
  }

  /* layout */
  .site-layout {
    padding: 0 50px 120px 50px;
    margin-top: 6rem;
    .contribute-footer {
      > div {
        height: 100px;
        align-items: center;
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
  .site-layout-background {
    padding: 8px 0;
    min-height: calc(100vh - 120px);
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

  /* title */
  .custom-text-secondary {
    display: inline-block;
    max-width: 400px;
    margin-bottom: 12px;
    svg {
      color: ${COLOR.BORDER_GREY};
    }
  }

  h2.ant-typography {
    margin-bottom: 8px;
  }

  /* hyperlinks */
  a.ant-typography,
  .ant-typography a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 4px;
    &:hover,
    &:active {
      text-decoration: underline;
      color: inherit;
    }
  }
`;

export default GlobalStyle;

export const Ellipsis = styled.span`
  max-width: 100px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${MEDIA_QUERY.tablet} {
    max-width: 200px;
  }
`;
