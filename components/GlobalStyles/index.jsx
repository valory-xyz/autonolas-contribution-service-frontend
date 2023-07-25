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
  .mb-2 {
    margin-bottom: 2px !important;
  }
  .mb-4 {
    margin-bottom: 4px !important;
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
  .mb-0 {
    margin-bottom: 0px !important;
  }
  .m-0 {
    margin: 0 !important;
  }
  .m-24 {
    margin: 24px !important;
  }
  .mb-8 {
    margin-bottom: 8px;
  }
  .mb-12 {
    margin-bottom: 12px;
  }
  .mb-16 {
    margin-bottom: 16px;
  }
  .mb-24 {
    margin-bottom: 24px;
  }
  .mr-8 {
    margin-right: 8px;
  }
  .mr-24 {
    margin-right: 24px;
  }
  .mt-8 {
    margin-top: 8px;
  }
  .mt-12 {
    margin-top: 12px;
  }
  .ml-12 {
    margin-left: 12px;
  }
  .mr-12 {
    margin-right: 12px;
  }
  .w-100 {
    width: 100%;
  }
  .text-right {
    float: right;
  }
  .text-small {
    font-size: 14px;
  }
  .bg-shaded {
    background-color: ${COLOR.GREY_3};
  }
  .border-bottom {
    border-bottom: 1px solid ${COLOR.BORDER_GREY};
  }
  .border-top {
    border-top: 1px solid ${COLOR.BORDER_GREY};
  }
  .border-left {
    border-left: 1px solid ${COLOR.BORDER_GREY};
  }
  .border-right {
    border-left: 1px solid ${COLOR.BORDER_GREY};
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

    // Group Chat
    .chat-bubble {
    background-color: ${COLOR.WHITE};
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid ${COLOR.BORDER_GREY};
    min-width: 100px;
    max-width: 450px;
    margin-bottom: 4px;
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
