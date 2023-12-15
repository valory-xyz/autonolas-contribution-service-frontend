import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isNil, last } from 'lodash';
import {
  Button, Typography, Popconfirm, Alert, Result,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { COLOR } from '@autonolas/frontend-library';

import { ProposalPropTypes } from 'common-util/prop-types';
import { useHelpers } from 'common-util/hooks/useHelpers';
import { useProposals } from '../../CoOrdinate/Centaur/hooks';

const { Text } = Typography;

const TweetValidating = () => (
  <>
    <Alert
      type="warning"
      message="Validating approvals and quorum amount…"
      showIcon
    />
    <br />
  </>
);

const TweetFailed = () => (
  <>
    <Alert
      type="error"
      message="Could not execute or post. This could mean the approving veOLAS amount did not meet quorum."
      showIcon
    />
    <br />
  </>
);

export const ExecuteStep = ({ isExecuteLoading, proposal, onExecute }) => {
  const { account } = useHelpers();
  const { getCurrentProposalInfo } = useProposals();

  const {
    isQuorumAchieved,
    totalVeolasInEth,
    remainingVeolasForApprovalInEth,
    isProposalVerified,
  } = getCurrentProposalInfo(proposal);

  const isPosted = proposal?.posted;
  const executionAttempts = useMemo(
    () => proposal?.executionAttempts || [],
    [proposal],
  );

  // If the last execution attempt is "null" & the proposal is not posted,
  // it means the proposal is BEING VALIDATED
  const isValidating = useMemo(() => {
    if (executionAttempts.length === 0) return false;

    return isNil(last(executionAttempts)?.verified) && !isPosted;
  }, [executionAttempts, isPosted]);

  // If the last execution attempt is "false" & the proposal is not posted,
  // it means the proposal execution FAILED
  const isFailed = useMemo(() => {
    if (executionAttempts.length === 0) return false;

    return last(executionAttempts)?.verified === false && !isPosted;
  }, [executionAttempts, isPosted]);

  if (isPosted) {
    return (
      <Result
        style={{ borderLeft: `1px solid ${COLOR.BORDER_GREY}` }}
        status="success"
        title="Tweet posted successfully!"
        extra={[
          <Button
            key={`extra-${proposal.action_id}`}
            type="primary"
            ghost
            href={proposal.action_id}
            rel="noopener noreferrer"
            target="_blank"
          >
            View tweet
          </Button>,
        ]}
      />
    );
  }

  return (
    <>
      {isValidating && <TweetValidating />}
      {isFailed && <TweetFailed />}

      <Popconfirm
        title="Are you sure？This will immediately post to the @autonolas Twitter account."
        icon={<ExclamationCircleOutlined style={{ color: COLOR.ORANGE }} />}
        onConfirm={onExecute}
      >
        <Button
          ghost
          type="primary"
          loading={isExecuteLoading}
          disabled={
            !account || !isQuorumAchieved || !isProposalVerified || isValidating
          }
          className="mb-12"
        >
          Execute & post tweet
        </Button>
      </Popconfirm>
      <br />

      {!isQuorumAchieved && (
        <Text text="secondary">
          {`To be executed, this proposal needs ${remainingVeolasForApprovalInEth} veOLAS. Current veOLAS: ${totalVeolasInEth}`}
        </Text>
      )}
    </>
  );
};

ExecuteStep.propTypes = {
  isExecuteLoading: PropTypes.bool,
  proposal: ProposalPropTypes,
  onExecute: PropTypes.func.isRequired,
};

ExecuteStep.defaultProps = {
  isExecuteLoading: false,
  proposal: {},
};
