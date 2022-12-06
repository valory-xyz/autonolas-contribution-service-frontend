import styled from 'styled-components';
import { MEDIA_QUERY } from 'util/theme';
import { backgroundImage } from 'components/GlobalStyles';

export const LeaderboardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${backgroundImage('/images/1TheNewWay/background.webp')}
  .header {
    text-align: center;
  }
  ${MEDIA_QUERY.laptop} {
  }
`;

export const LeaderboardContent = styled.div`
  .leaderboard-table {
    iframe {
      margin: 0 auto 3rem auto;
      display: flex;
    }
  }
`;
