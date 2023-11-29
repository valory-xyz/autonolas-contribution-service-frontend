import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useSignMessage } from 'wagmi';
import {
  cloneDeep, isNil, last, set,
} from 'lodash';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Typography,
  Button,
  Card,
  Row,
  Col,
  Steps,
  Result,
  Progress,
  Popconfirm,
  Alert,
} from 'antd';
import {
  COLOR,
  NA,
  notifyError,
  notifySuccess,
} from '@autonolas/frontend-library';

import { VEOLAS_QUORUM } from 'util/constants';
import DisplayName from 'common-util/DisplayName';
import { ethersToWei, getNumberInMillions } from 'common-util/functions';
import { ProposalPropTypes } from 'common-util/prop-types';
import { useHelpers } from 'common-util/hooks/useHelpers';
import { fetchVeolasBalance } from '../../MembersList/requests';
import {
  useCentaursFunctionalities,
  useProposals,
} from '../../CoOrdinate/Centaur/hooks';
import { ViewThread } from '../ViewThread';
import { getFirstTenCharsOfTweet } from '../utils';

const { Text } = Typography;
const STEPS = { APPROVE: 0, EXECUTE: 1 };

export const Proposal = ({ proposal }) => {
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isExecuteLoading, setIsExecuteLoading] = useState(false);
  const [current, setCurrent] = useState(STEPS.APPROVE);

  const { account } = useHelpers();
  const {
    fetchedUpdatedMemory,
    updateMemoryWithNewCentaur,
    currentMemoryDetails: centaur,
  } = useCentaursFunctionalities();
  const { triggerAction, getCurrentProposalInfo } = useProposals();

  const {
    isExecutable,
    votersAddress,
    totalVeolasInEth,
    remainingVeolasForApprovalInEth,
    totalVeolasInvestedInPercentage,
    isProposalVerified,
  } = getCurrentProposalInfo(proposal);
  const hasVoted = votersAddress?.includes(account) || false;
  const canMoveToExecuteStep = isExecutable || proposal.posted;

  const { signMessageAsync } = useSignMessage();

  // set current step
  useEffect(() => {
    setCurrent(canMoveToExecuteStep ? STEPS.EXECUTE : STEPS.APPROVE);
  }, [isExecutable, proposal.posted]);

  const onApprove = async () => {
    if (!account) {
      notifyError('Please connect your wallet to vote.');
      return;
    }

    if (hasVoted) {
      notifyError('You have already voted for this option.');
      return;
    }

    try {
      setIsApproveLoading(true);

      // Check if the user has at least 1 veOlas
      const accountVeOlasBalance = await fetchVeolasBalance({ account });
      if (ethers.BigNumber.from(accountVeOlasBalance).lte(ethersToWei('1'))) {
        notifyError('You need at least 1 veOLAS to vote');
        return;
      }

      const signature = await signMessageAsync({
        message: `I am signing a message to verify that I approve the tweet starting with ${getFirstTenCharsOfTweet(
          proposal.text,
        )}...`,
      });

      // Update proposal with the new voter, signature & veOlas balance
      const vote = {
        address: account,
        signature,
        votingPower: accountVeOlasBalance,
      };
      const updatedProposal = cloneDeep(proposal);
      const updatedVotersWithVeOlas = [...(proposal.voters || []), vote];
      set(updatedProposal, 'voters', updatedVotersWithVeOlas);

      const updatedTweets = centaur?.plugins_data?.scheduled_tweet?.tweets?.map(
        (tweet) => (tweet.request_id === proposal.request_id ? updatedProposal : tweet),
      );

      // Update centaur with updated tweets
      const updatedCentaur = cloneDeep(centaur);
      set(updatedCentaur, 'plugins_data.scheduled_tweet.tweets', updatedTweets);

      const commitId = await updateMemoryWithNewCentaur(updatedCentaur);
      notifySuccess('Proposal approved');

      // Add voting action to the centaur
      const action = {
        actorAddress: account,
        commitId,
        description: 'approved a proposal',
        timestamp: Date.now(),
      };

      await triggerAction(centaur.id, action);
      await fetchedUpdatedMemory();
    } catch (error) {
      notifyError('Failed to approve proposal');
      console.error(error);
    } finally {
      if (isExecutable) {
        setIsApproveLoading(false);
        setCurrent(1);
      }
    }
  };

  const onExecute = async () => {
    if (!account) {
      notifyError('To execute, connect your wallet.');
      return;
    }

    if (!isExecutable) {
      notifyError('This proposal needs more approvals to be executed.');
      return;
    }

    try {
      setIsExecuteLoading(true);

      const executionAttempts = [
        ...(proposal.executionAttempts || []),
        { id: uuid(), dateCreated: Date.now(), verified: null },
      ];

      set(proposal, 'executionAttempts', executionAttempts);

      const updatedTweets = centaur?.plugins_data?.scheduled_tweet?.tweets?.map(
        (tweet) => (tweet.request_id === proposal.request_id ? proposal : tweet),
      );

      // Update centaur with updated tweets
      const updatedCentaur = cloneDeep(centaur);
      set(updatedCentaur, 'plugins_data.scheduled_tweet.tweets', updatedTweets);

      const commitId = await updateMemoryWithNewCentaur(updatedCentaur);
      notifySuccess('Proposal executed');

      // Add voting action to the centaur
      const action = {
        actorAddress: account,
        commitId,
        description: 'executed a proposal',
        timestamp: Date.now(),
      };
      await triggerAction(centaur.id, action);
      await fetchedUpdatedMemory();
    } catch (error) {
      window?.console.error(error);
    } finally {
      setIsExecuteLoading(false);
    }
  };

  const tweetOrThread = proposal?.text || [];

  const ApproveStep = (
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

          {!account && (
            <>
              <br />
              <Text type="secondary">To approve, connect your wallet</Text>
            </>
          )}
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

  // If the last execution attempt is "null" & the proposal is not posted,
  // it means the proposal is BEING VALIDATED
  const isValidating = isNil(last(proposal?.executionAttempts)) && !proposal?.posted;

  // If the last execution attempt is "false" & the proposal is not posted,
  // it means the proposal execution FAILED
  const isFailed = last(proposal?.executionAttempts)?.verified === false && !proposal?.posted;

  const ExecuteStep = proposal.posted ? (
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
  ) : (
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

  const steps = [
    { key: 'approve', title: 'Approve', content: ApproveStep },
    { key: 'execute', title: 'Execute', content: ExecuteStep },
  ];

  const onChange = (value) => {
    setCurrent(value === 0 ? STEPS.APPROVE : STEPS.EXECUTE);
  };

  const proposedDate = proposal?.createdDate
    ? dayjs.unix(proposal.createdDate).format('HH:mm DD/M/YY')
    : '--';

  const getProposalVerificationStatus = useCallback(() => {
    if (isNil(isProposalVerified)) return 'Unvalidated';
    return isProposalVerified ? 'Validated' : 'Not yet validated';
  }, [isProposalVerified]);

  return (
    <Card className="mb-24" bodyStyle={{ padding: 0 }}>
      <Row gutter={24} className="p-24">
        <Col md={6} xs={24}>
          <Steps
            current={current}
            items={steps}
            direction="vertical"
            onChange={onChange}
          />
        </Col>
        <Col md={18} xs={24}>
          <div>{steps[current]?.content}</div>
        </Col>
      </Row>
      <div className="p-24">
        <Text type="secondary">
          {'Proposed by: '}
          {proposal?.proposer?.address ? (
            <DisplayName actorAddress={proposal.proposer.address} />
          ) : (
            NA
          )}
          {` · Status: ${getProposalVerificationStatus()} · Date: ${proposedDate}`}
        </Text>
      </div>
    </Card>
  );
};

Proposal.propTypes = {
  proposal: ProposalPropTypes,
};

Proposal.defaultProps = {
  proposal: {},
};
