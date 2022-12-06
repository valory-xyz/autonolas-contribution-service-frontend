import styled, { createGlobalStyle } from 'styled-components';
import { MEDIA_QUERY, COLOR } from 'util/theme';

// const GlobalStyles = styled.div`
const GlobalStyle = createGlobalStyle`
  *,
  :after,
  :before {
    box-sizing: border-box;
  }

  /* common */
  .mb-8 {
    margin-bottom: 0.5rem;
  }
  .walletconnect-modal__base {
    .walletconnect-modal__mobile__toggle a {
      color: ${COLOR.WALLECT_CONNECT_BLUE} !important;
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
    padding: 0 50px;
    margin-top: 64px;
  }
  .site-layout-background {
    padding: 24px 0;
    min-height: calc(100vh - 140px);
  }

  ${MEDIA_QUERY.mobileL} {
    .show-only-sm {
      display: initial;
    }
    .hide-only-sm {
      display: none;
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
