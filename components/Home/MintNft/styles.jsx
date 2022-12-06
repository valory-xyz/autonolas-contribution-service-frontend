import styled from 'styled-components';
import { COLOR } from 'util/theme';
// import { COLOR, MEDIA_QUERY } from 'util/theme';

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
  }
  .ant-btn-link {
    padding: 0;
    line-height: normal;
    height: fit-content;
  }
`;

export const WriteFunctionalityContainer = styled.div``;
