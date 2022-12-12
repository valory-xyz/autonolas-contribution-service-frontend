import styled from 'styled-components';
import { Layout } from 'antd/lib';
import { COLOR, MEDIA_QUERY } from '@autonolas/frontend-library';

export const CustomLayout = styled(Layout)`
  .registry-tabs {
    .ant-tabs-extra-content {
      &:not(:last-child) {
        .ant-typography {
          color: ${COLOR.PRIMARY};
          margin: 0 12px 0 0;
        }
      }
      &:last-child {
        gap: 12px;
        display: flex;
      }
    }
    .ant-tabs-nav-wrap {
      padding-left: 16px;
    }
  }
  .footer-left-content {
    width: 100%;
  }
  .footer-center {
    display: none !important;
  }
`;

export const Logo = styled.div`
  width: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-left: 0.5rem;
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

export const ContractsInfoContainer = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  .registry-contract {
    display: flex;
    align-items: center;
  }
  img {
    margin-right: 8px;
  }
  .dot {
    display: inline-block;
    position: relative;
    top: -2px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }
  .dot-online {
    background-color: #42ff00;
  }
  .dot-offline {
    background-color: #ff8a00;
  }

  ${MEDIA_QUERY.mobileM} {
    flex-direction: column;
  }
`;

export const PoweredByLogo = styled.div`
  display: flex;
  margin-right: 1rem;
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

export const FixedFooter = styled.div`
  position: fixed;
  bottom: 0;
  background: white;
  width: 100%;
  border-top: 1px solid #f0f0f0;
`;
