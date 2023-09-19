import {
  Alert, Card, List, Skeleton,
} from 'antd/lib';

import { EducationTitle } from 'common-util/Education/EducationTitle';
import Proposal from './Proposal';
import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';

const Proposals = () => {
  const {
    isMemoryDetailsLoading: isLoading,
    currentMemoryDetails,
    isAddressPresent,
  } = useCentaursFunctionalities();
  const proposals = currentMemoryDetails?.plugins_data?.scheduled_tweet?.tweets || [];
  const sortedProposals = proposals.sort(
    (a, b) => b.createdDate - a.createdDate,
  );

  return (
    <>
      <div className="mb-24">
        <EducationTitle title="Proposed tweets" educationItem="proposals" />
      </div>

      {isLoading ? (
        <>
          <Card className="mb-12">
            <Skeleton active />
          </Card>

          <Card>
            <Skeleton active />
          </Card>
        </>
      ) : (
        <>
          {proposals.length > 0 ? (
            <List>
              {sortedProposals.map((proposal) => (
                <Proposal
                  key={proposal.request_id}
                  proposal={proposal}
                  isAddressPresent={isAddressPresent}
                />
              ))}
            </List>
          ) : (
            <Alert message="No proposals" showIcon type="info" />
          )}
        </>
      )}
    </>
  );
};

export default Proposals;
