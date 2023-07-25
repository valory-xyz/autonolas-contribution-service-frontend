import styled from 'styled-components';

export const HomeContainer = styled.div``;

export const MainTitle = styled.div`
  display: flex;
  align-items: center;
`;

export const InnerLayoutContainer = styled.div`
  background-color: #f0f0f0;
  padding: 24px;
  height: 100%;
    ${(props) => (props.currentTab === 'home'
    ? {}
    : {
      overflow: 'auto',
    })};
`;
