import styled from 'styled-components';
import { COLOR, MEDIA_QUERY } from '@autonolas/frontend-library';

export const StickyContainer = styled.div`
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  line-height: normal;
  z-index: 1000;
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

export const OffChainContainer = styled.div`
  margin-right: 1.5rem;
`;

export const MobileOffChainContainer = styled.div`
  display: flex;
  flex-direction: column;
  div:first-child {
    margin-bottom: 2px;
  }
`;

export const ContractsInfoContainer = styled(StickyContainer)`
  right: 1rem;
  display: flex;
  align-items: center;
  background: ${COLOR.WHITE};
  border: 1px solid ${COLOR.GREY_3};
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  font-size: 16px;
  padding: 12px;
  transition: all 0.3s;
  .status-sub-header {
    text-transform: uppercase;
    font-size: 14px;
  }
  .status-sub-content {
    display: flex;
    align-items: center;
    line-height: 1.75;
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
    background-color: ${COLOR.GREEN_2};
  }
  .dot-offline {
    background-color: ${COLOR.ORANGE};
  }
  .minimize-btn {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
  }
  .ant-statistic-content-suffix {
    margin-left: 0px;
  }

  ${MEDIA_QUERY.mobileL} {
    font-size: 14px;
    padding: 0.5rem;
  }
`;

export const Badge = styled.div`
  display: flex;
  margin-right: 1rem;
  a {
    line-height: normal;
    height: 56px;
  }

  ${MEDIA_QUERY.mobileL} {
    margin-right: 0.5rem;
  }
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
  background: ${COLOR.WHITE};
  width: 100%;
  border-top: 1px solid ${COLOR.GREY_3};
`;
