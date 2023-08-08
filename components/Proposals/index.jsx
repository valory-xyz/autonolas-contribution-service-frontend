import PropTypes from 'prop-types';
import { Alert, List } from 'antd/lib';

import { EducationTitle } from 'common-util/Education/EducationTitle';
import Proposal from './Proposal';
import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';

const Proposals = ({ isAddressPresent }) => {
  const { currentMemoryDetails } = useCentaursFunctionalities();
  const proposals = currentMemoryDetails?.plugins_data?.scheduled_tweet?.tweets || [];

  return (
    <>
      <div className="mb-24">
        <EducationTitle title="Proposals" educationItem="proposals" />
      </div>
      {proposals.length > 0 ? (
        <List>
          {proposals.map((proposal) => (
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
  );
};

Proposals.propTypes = {
  isAddressPresent: PropTypes.bool.isRequired,
};

Proposals.defaultProps = {};

export default Proposals;
