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

export const ExecuteStep = ({ isExecuteLoading, proposal, onExecute }) => {
  const { account } = useHelpers();
  const { getCurrentProposalInfo } = useProposals();

  const {
    isExecutable,
    totalVeolasInEth,
    remainingVeolasForApprovalInEth,
    isProposalVerified,
  } = getCurrentProposalInfo(proposal);

  // If the last execution attempt is "null" & the proposal is not posted,
  // it means the proposal is BEING VALIDATED
  const isValidating = isNil(last(proposal?.executionAttempts)) && !proposal?.posted;

  // If the last execution attempt is "false" & the proposal is not posted,
  // it means the proposal execution FAILED
  const isFailed = last(proposal?.executionAttempts)?.verified === false && !proposal?.posted;

  if (proposal.posted) {
    return (
      <Result
        status="success"
        title="Tweet posted successfully!"
        extra={[
          <Button
            type="primary"
            ghost
            key="tweet-successful"
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
      {isValidating && (
        <>
          <Alert
            type="warning"
            message="Tweet is being validated. Please wait."
            showIcon
          />
          <br />
        </>
      )}

      {isFailed && (
        <>
          <Alert
            type="error"
            message="Tweet failed to post. Please try again."
            showIcon
          />
          <br />
        </>
      )}

      <Popconfirm
        title="Are you sure？This will immediately post to the @autonolas Twitter account."
        icon={<ExclamationCircleOutlined style={{ color: COLOR.ORANGE }} />}
        onConfirm={onExecute}
      >
        <Button
          ghost
          type="primary"
          loading={isExecuteLoading || isValidating}
          disabled={
            !account || !isExecutable || !isProposalVerified || isValidating
          }
          className="mb-12"
        >
          Execute & post tweet
        </Button>
      </Popconfirm>
      <br />

      {!isExecutable && (
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
