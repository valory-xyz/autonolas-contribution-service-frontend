import styled, { css } from 'styled-components';
import { Collapse } from 'antd/lib';
import { COLOR, MEDIA_QUERY } from 'util/theme';

const navStyle = css`
  border-bottom: 1px solid ${COLOR.WHITE};
  font-size: 18px;
  text-transform: uppercase;
`;

export const Container = styled.div``;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const WrapperDiv = styled.div`
  width: 100%;
  margin: 1rem 0;
  padding: 0.5rem 0;
  border: 1px solid ${COLOR.GREEN_2};
  border-radius: 4px;
  overflow: auto;
  cursor: pointer;
  .text {
    padding: 0 1rem;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .documentation-chapters {
    transition: 0.2s;
  }
`;

export const DocSection = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 16px;
  .navigation-section {
    position: sticky;
    top: 108px;
    width: 25%;
    max-width: 380px;
  }
  .reading-section {
    max-width: 1000px;
    padding: 0 10rem;
    h3 {
      font-weight: bold;
      /* margin: 0; */
    }
    .green-text-2 {
      font-size: 19px;
      color: ${COLOR.GREEN_2};
      font-family: "minecraft", sans-serif;
    }
    .img-wrapper {
      position: relative;
      left: -6rem;
      img {
        width: calc(100vw - 30rem);
        max-width: 1200px;
      }
    }

    /* TODO: remove */
    .section-disclaimer {
      font-style: italic;
    }
  }
  .ant-anchor {
    .ant-anchor-ink {
      display: none;
    }
    .ant-anchor-link {
      padding-left: 0px;
      .ant-anchor-link-title {
        color: inherit;
        text-decoration: none;
      }
      &.bold .ant-anchor-link-title {
        color: ${COLOR.WHITE};
        font-size: 15px;
      }
    }
  }

  /* custom nav-anchor */
  .custom-nav-anchor {
    ${navStyle}
    padding: 6px 40px 6px 0px;
    padding-left: ${({ isMobile }) => (isMobile ? '16px' : '0')};
    a.ant-anchor-link-title {
      font-size: 18px;
      text-decoration: none;
    }
  }
  .custom-nav-anchor-active a.ant-anchor-link-title {
    color: ${COLOR.GREEN_2} !important;
  }

  ${MEDIA_QUERY.laptop} {
    .reading-section {
      .img-wrapper img {
        width: calc(100vw - 22rem);
      }
    }
  }

  ${MEDIA_QUERY.tabletL} {
    .reading-section {
      padding: 0 2rem;
      .img-wrapper {
        position: relative;
        left: 0;
        img {
          width: 100%;
          max-width: 100%;
        }
      }
    }
  }

  ${MEDIA_QUERY.tablet} {
    flex-direction: column;
    .navigation-section {
      position: relative;
      top: 0;
      width: 100%;
      max-width: 100%;
    }
    .reading-section {
      padding: 0 1rem;
    }
  }
`;

export const DocNavigation = styled(Collapse)`
  .ant-collapse-content-box {
    .ant-anchor-link .ant-anchor-link-title {
      font-size: 16px;
    }
  }

  &.doc-mobile-navigation {
    .ant-collapse-header {
      padding-left: 1rem !important;
    }
    .ant-collapse-content-box {
      padding-left: 2rem;
      .ant-anchor-link .ant-anchor-link-title {
        font-size: 14px;
      }
    }
    &.last-navigation-item .ant-collapse-header {
      border-bottom-color: transparent;
    }
  }
  .ant-collapse-header {
    padding-left: 0 !important;
    ${navStyle}
  }
  &.custom-ant-collapse-active .ant-collapse-header {
    color: ${COLOR.GREEN_2} !important;
  }

  & > .ant-collapse-item:last-child,
  & > .ant-collapse-item:last-child > .ant-collapse-header {
    border-radius: 0px !important;
  }

  ${MEDIA_QUERY.desktop} {
  }
`;

export const ComparisonTable = styled.div`
  overflow-x: auto;
  table {
    width: 100%;
    background-color: transparent;
    border-collapse: collapse;
    color: ${COLOR.GREY_1};
    border: 1px solid ${COLOR.BORDER_GREY};
    th,
    td {
      padding: 1rem 1rem;
      border: 1px solid ${COLOR.BORDER_GREY};
      &:first-child {
        border-right-color: transparent;
      }
    }
    thead {
      tr th {
        &:nth-child(1) {
          /* width: 35%; */
        }
      }
    }
    tbody {
      tr td {
        &:not(:first-child) {
          text-align: center;
        }
      }
    }
  }

  ${MEDIA_QUERY.mobileL} {
    margin: 0 -1rem;
    table {
      th,
      td {
        padding: 0.5rem 0.3rem;
        word-break: break-word;
        font-size: 12px;
      }
    }
  }
`;

export const Footnote = styled.div`
  font-size: 12px;
  font-style: italic;
`;
