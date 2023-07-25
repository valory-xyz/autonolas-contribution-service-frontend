import styled from 'styled-components';
import { Layout } from 'antd/lib';
import { COLOR, MEDIA_QUERY } from '@autonolas/frontend-library';

export const CustomLayout = styled(Layout)`
  .site-layout {
    padding: ${({ isCoordinatePage }) => (isCoordinatePage ? '0' : ' 0 50px 120px 50px;')};
    margin-top: 6rem;
    .contribute-footer {
      > div {
        height: 100px;
        align-items: center;
        padding-left: 0;
        padding-right: 0;
      }
    }
    .site-layout-background {
      padding: ${({ isCoordinatePage }) => (isCoordinatePage ? '0' : '8px 0;')};
      min-height: calc(100vh - 120px);
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
  margin-left: 0.5rem;
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

export const LoginXsContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;
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
  padding: 2.5rem 3rem;
  background-color: ${COLOR.WHITE};
  border-bottom: 1px solid ${COLOR.BORDER_GREY};
`;
