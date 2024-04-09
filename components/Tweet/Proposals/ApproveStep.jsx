import PropTypes from 'prop-types';
import {
  Button, Typography, Card, Progress,
} from 'antd';
import { NA } from '@autonolas/frontend-library';

import { VEOLAS_QUORUM } from 'util/constants';
import { getNumberInMillions } from 'common-util/functions';
import { ProposalPropTypes } from 'common-util/prop-types';
import { useHelpers } from 'common-util/hooks/useHelpers';
import { useMemo } from 'react';
import { useProposals } from '../../CoOrdinate/Centaur/hooks';
import { ViewThread } from '../ViewThread';
import MediaList, { MODE } from '../MediaList';

const { Text } = Typography;

const ConnectWalletToApprove = () => (
  <Text type="secondary" className="px-12">
    To approve, connect your wallet
  </Text>
);

export const ApproveStep = ({ isApproveLoading, proposal, onApprove }) => {
  const { getCurrentProposalInfo } = useProposals();
  const { account } = useHelpers();

  const {
    isQuorumAchieved,
    votersAddress,
    totalVeolasInEth,
    totalVeolasInvestedInPercentage,
    isProposalVerified,
  } = getCurrentProposalInfo(proposal);
  const hasVoted = votersAddress?.includes(account) ?? false;
  const canMoveToExecuteStep = isQuorumAchieved || proposal.posted;
  const isApproveDisabled = !account || !isProposalVerified || proposal?.posted;

  const tweetData = useMemo(() => {
    if (typeof proposal?.text === 'string') {
      return { tweet: { text: proposal.text, media: proposal?.media_hashes ?? [] } };
    }

    if (Array.isArray(proposal?.text)) {
      return {
        thread: proposal.text.map((text, index) => ({
          text,
          media: (proposal?.media_hashes ?? [])[index] ?? [],
        })),
      };
    }

    return {};
  }, [proposal?.media_hashes, proposal?.text]);

  return (
    <>
      <Card className="mb-12" bodyStyle={{ padding: 16 }}>
        {/* If string, just a tweet else a thread (array of string) */}
        {tweetData.tweet && (
          <>
            <div className="mb-12">
              <Text>{tweetData.tweet.text ?? NA}</Text>
            </div>
            <MediaList media={tweetData.tweet.media} mode={MODE.VIEW} className="mb-12" />
            <Text type="secondary">
              {tweetData.tweet.text.length}
              /280 characters
            </Text>
          </>
        )}
        {tweetData.thread && (
          <ViewThread thread={tweetData.thread} />
        )}
      </Card>

      {hasVoted ? (
        <Text className="mb-8">✅ You approved</Text>
      ) : (
        <div className="mb-8">
          <Button
            ghost
            type="primary"
            loading={isApproveLoading}
            disabled={isApproveDisabled}
            onClick={onApprove}
          >
            Approve this tweet
          </Button>

          {!account && <ConnectWalletToApprove />}
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
