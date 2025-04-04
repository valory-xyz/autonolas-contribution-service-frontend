import { Alert, Card, List, Skeleton } from 'antd';

import { EducationTitle } from 'common-util/Education/EducationTitle';

import { useCentaursFunctionalities } from '../../CoOrdinate/Centaur/hooks';
import { Proposal } from './Proposal';

const ProposalLoader = () => (
  <>
    <Card className="mb-12">
      <Skeleton active />
    </Card>

    <Card>
      <Skeleton active />
    </Card>
  </>
);

export const Proposals = () => {
  const { isMemoryDetailsLoading: isLoading, currentMemoryDetails } = useCentaursFunctionalities();
  const proposals = currentMemoryDetails?.plugins_data?.scheduled_tweet?.tweets || [];
  const sortedProposals = [...proposals].sort((a, b) => b.createdDate - a.createdDate);

  return (
    <>
      <div className="mb-24">
        <EducationTitle title="Proposed posts" educationItem="proposals" />
      </div>

      {isLoading ? (
        <ProposalLoader />
      ) : (
        <>
          {proposals.length > 0 ? (
            <List>
              {sortedProposals.map((proposal) => (
                <Proposal key={proposal.request_id} proposal={proposal} />
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
