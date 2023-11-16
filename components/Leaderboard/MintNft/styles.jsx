import styled from 'styled-components';
import { Card } from 'antd';
import { COLOR } from '@autonolas/frontend-library';

export const IMAGE_SIZE = 300;

export const MintNftContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  .connect-wallet-info {
    margin: 1rem 0;
    .ant-alert-message {
      p {
        margin: 0;
      }
    }
  }
  .nft-image {
    margin: 0;
    padding: 1rem;
    border: 1px solid ${COLOR.GREY_1};
    background-color: ${COLOR.WHITE};
    border-radius: 10px;
  }
  .ant-btn-link {
    padding: 0;
    line-height: normal;
    height: fit-content;
  }
  .skeleton-image-loader {
    width: ${IMAGE_SIZE}px;
    height: ${IMAGE_SIZE}px;
    border-radius: 1rem;
    > svg {
      transform: scale(2.5);
    }
  }
`;

export const WriteFunctionalityContainer = styled.div``;

export const MintBadgeCardContainer = styled(Card)`
  // width: 300px;
`;
