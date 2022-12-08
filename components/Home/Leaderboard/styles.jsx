import styled from 'styled-components';

export const LeaderboardContent = styled.div`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    padding: 12px 16px;
  }

  /* TODO: check */
  /* scroll-bar */
  ::-webkit-scrollbar {
    height: 16px;
    overflow: visible;
    width: 16px;
  }
  ::-webkit-scrollbar-button {
    height: 0;
    width: 0;
  }
  ::-webkit-scrollbar-corner {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    border-style: solid;
    border-color: transparent;
    border-width: 4px;
    background-color: #dadce0;
    border-radius: 8px;
    box-shadow: none;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    background-clip: padding-box;
    border: solid transparent;
    border-width: 1px 1px 1px 6px;
    min-height: 28px;
    padding: 100px 0 0;
    box-shadow: inset 1px 1px 0 rgb(0 0 0 / 10%), inset 0 -1px 0 rgb(0 0 0 / 7%);
  }
  ::-webkit-scrollbar-track {
    box-shadow: none;
    margin: 0 4px;
  }
  ::-webkit-scrollbar-track {
    background-clip: padding-box;
    border: solid transparent;
    border-width: 0 0 0 4px;
  }
`;
