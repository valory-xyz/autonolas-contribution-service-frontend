import styled from 'styled-components';
import { Modal } from 'antd/lib';

export const CentaurPageBody = styled.div`
  min-height: calc(100vh - 64px);
`;

export const CentaurTableContainer = styled.div``;

export const WelcomeMessageModal = styled(Modal)`
  top: 1rem;
  .centaur-image {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
  }
  .centaur-contents {
    padding-left: 1.5rem;
    margin-bottom: 0;
    li {
      &:not(:last-child) {
        margin-bottom: 1rem;
      }
      .centaur-each-content {
        display: flex;
        gap: 10px;
        .centaur-content-text {
          display: flex;
          flex-direction: column;
          width: 60%;
          .ant-typography:nth-child(2) {
            margin-top: 0.5rem;
          }
        }
        .centaur-content-image {
          flex: 1;
          text-align: center;
        }
      }
    }
  }
`;
