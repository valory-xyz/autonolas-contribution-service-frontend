import { useEffect } from 'react';
import styled from 'styled-components';

import { useCentaursFunctionalities } from 'components/CoOrdinate/Centaur/hooks';

const StyledPre = styled.pre`
  max-width: 800px;
  overflow-x: auto;
`;

const StatePage = () => {
  const { currentMemoryDetails, fetchUpdatedMemory } = useCentaursFunctionalities();

  useEffect(() => {
    fetchUpdatedMemory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledPre>{JSON.stringify(currentMemoryDetails, undefined, 2)}</StyledPre>
  );
};

export default StatePage;
