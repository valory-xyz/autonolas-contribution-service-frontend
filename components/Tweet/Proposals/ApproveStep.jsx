import PropTypes from 'prop-types';
import {
  Button, Typography, Card, Progress,
} from 'antd';
import { NA } from '@autonolas/frontend-library';

import { VEOLAS_QUORUM } from 'util/constants';
import { getNumberInMillions } from 'common-util/functions';
import { ProposalPropTypes } from 'common-util/prop-types';
import { useHelpers } from 'common-util/hooks/useHelpers';
import { useProposals } from '../../CoOrdinate/Centaur/hooks';
import { ViewThread } from '../ViewThread';

const { Text } = Typography;

const ConnectWallet = () => (
  <>
    <br />
    <Text type="secondary">To approve, connect your wallet</Text>
  </>
);

export const ApproveStep = ({ isApproveLoading, proposal, onApprove }) => {
  const { getCurrentProposalInfo } = useProposals();
  const { account } = useHelpers();

  const {
    isExecutable,
    votersAddress,
    totalVeolasInEth,
    totalVeolasInvestedInPercentage,
    isProposalVerified,
  } = getCurrentProposalInfo(proposal);
  const tweetOrThread = proposal?.text || [];
  const hasVoted = votersAddress?.includes(account) || false;
  const canMoveToExecuteStep = isExecutable || proposal.posted;

  return (
    <>
      <Card className="mb-12" bodyStyle={{ padding: 16 }}>
        {/* If string, just a tweet else a thread (array of string) */}
        {typeof tweetOrThread === 'string' ? (
          <>
            <div className="mb-12">
              <Text>{tweetOrThread || NA}</Text>
            </div>
            <Text type="secondary">
              {tweetOrThread.length || 0}
              /280 characters
            </Text>
          </>
        ) : (
          <ViewThread thread={tweetOrThread || []} />
        )}
      </Card>

      {hasVoted ? (
        <Text className="mb-8">✅ You approved</Text>
      ) : (
        <div className="mb-8">
          <Button
            ghost
            type="primary"
            onClick={onApprove}
            loading={isApproveLoading}
            disabled={!account || !isProposalVerified}
          >
            Approve this tweet
          </Button>

          {!account && <ConnectWallet />}
        </div>
      )}

      <div className="mb-12">
        <div>
          {`${getNumberInMillions(totalVeolasInEth)} veOLAS has approved`}
        </div>
        <div>
          {`Quorum ${canMoveToExecuteStep ? '' : 'not '} achieved ${
            canMoveToExecuteStep ? '✅ ' : ''
          } - ${getNumberInMillions(totalVeolasInEth)}/${getNumberInMillions(
            VEOLAS_QUORUM,
          )} veOLAS`}
        </div>
        <Progress percent={totalVeolasInvestedInPercentage} />
      </div>
    </>
  );
};

ApproveStep.propTypes = {
  isApproveLoading: PropTypes.bool,
  proposal: ProposalPropTypes,
  onApprove: PropTypes.func.isRequired,
};

ApproveStep.defaultProps = {
  isApproveLoading: false,
  proposal: {},
};
