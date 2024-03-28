import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useSignMessage } from 'wagmi';
import { cloneDeep, isNil, set } from 'lodash';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import {
  Typography, Card, Row, Col, Steps,
} from 'antd';
import { NA, notifyError, notifySuccess } from '@autonolas/frontend-library';

import DisplayName from 'common-util/DisplayName';
import { ProposalPropTypes } from 'common-util/prop-types';
import { VEOLAS_QUORUM } from 'util/constants';
import { useHelpers } from 'common-util/hooks/useHelpers';
import { fetchVotingPower } from '../../MembersList/requests';
import {
  useCentaursFunctionalities,
  useProposals,
} from '../../CoOrdinate/Centaur/hooks';
import { getFirstTenCharsOfTweet } from '../utils';
import { ExecuteStep } from './ExecuteStep';
import { ApproveStep } from './ApproveStep';

const { Text } = Typography;
const STEPS = { APPROVE: 0, EXECUTE: 1 };

export const Proposal = ({ proposal }) => {
  const [current, setCurrent] = useState(STEPS.APPROVE);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isExecuteLoading, setIsExecuteLoading] = useState(false);

  const { signMessageAsync } = useSignMessage();
  const { account, isStaging } = useHelpers();
  const {
    fetchUpdatedMemory,
    updateMemoryWithNewCentaur,
    currentMemoryDetails: centaur,
    triggerAction,
  } = useCentaursFunctionalities();
  const { getCurrentProposalInfo } = useProposals();

  const { isQuorumAchieved, votersAddress, isProposalVerified } = getCurrentProposalInfo(proposal);
  const hasVoted = votersAddress?.includes(account) || false;
  const canMoveToExecuteStep = isQuorumAchieved || proposal.posted;

  // set current step
  useEffect(() => {
    setCurrent(canMoveToExecuteStep ? STEPS.EXECUTE : STEPS.APPROVE);
  }, [canMoveToExecuteStep]);

  const onApprove = async () => {
    if (!account) {
      notifyError('Connect your wallet to approve.');
      return;
    }

    if (hasVoted) {
      notifyError('You already approved.');
      return;
    }

    try {
      setIsApproveLoading(true);

      // Check if the user has at least 1 veOlas
      const accountVeOlasBalance = await fetchVotingPower({ account });
      const accountVeOlasBalanceInEth = Number(
        ethers.formatEther(accountVeOlasBalance),
      );
      if (!isStaging && accountVeOlasBalanceInEth < 1) {
        notifyError('You need at least 1 veOLAS to approve');
        return;
      }

      const signature = await signMessageAsync({
        message: `I am signing a message to verify that I approve the tweet starting with ${getFirstTenCharsOfTweet(
          proposal.text,
        )}`,
      });

      // Update proposal with the new voter, signature & veOlas balance
      const vote = {
        address: account,
        signature,
        // add 2 million veOLAS in wei to the voter (if staging) or the account's veOLAS balance
        votingPower: isStaging ? VEOLAS_QUORUM : accountVeOlasBalanceInEth,
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

      const updateMemoryDetailsList = await fetchUpdatedMemory();
      await triggerAction(centaur.id, action, updateMemoryDetailsList);
    } catch (error) {
      notifyError('Failed to approve proposal');
      console.error(error);
    } finally {
      setIsApproveLoading(false);
      if (isQuorumAchieved) {
        setCurrent(STEPS.EXECUTE);
      }
    }
  };

  const onExecute = async () => {
    if (!account) {
      notifyError('To execute, connect your wallet.');
      return;
    }

    if (!isStaging && !isQuorumAchieved) {
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
      const updateMemoryDetailsList = await fetchUpdatedMemory();
      await triggerAction(centaur.id, action, updateMemoryDetailsList);
    } catch (error) {
      notifyError('Failed to execute');
      console.error(error);
    } finally {
      setIsExecuteLoading(false);
    }
  };

  const steps = [
    {
      key: 'approve',
      title: 'Approve',
      content: (
        <ApproveStep
          isApproveLoading={isApproveLoading}
          proposal={proposal}
          onApprove={onApprove}
        />
      ),
    },
    {
      key: 'execute',
      title: 'Execute',
      content: (
        <ExecuteStep
          isExecuteLoading={isExecuteLoading}
          proposal={proposal}
          onExecute={onExecute}
        />
      ),
    },
  ];

  const proposedDate = proposal?.createdDate
    ? dayjs.unix(proposal.createdDate).format('HH:mm DD/M/YY')
    : '--';

  const getProposalVerificationStatus = useCallback(() => {
    if (isNil(isProposalVerified)) return 'Validating…';
    return isProposalVerified ? 'Valid' : 'Invalid';
  }, [isProposalVerified]);

  return (
    <Card className="mb-24" bodyStyle={{ padding: 0 }}>
      <Row gutter={24} className="p-24">
        <Col md={6} xs={24}>
          <Steps
            direction="vertical"
            current={current}
            items={steps}
            onChange={(e) => setCurrent(e === 0 ? STEPS.APPROVE : STEPS.EXECUTE)}
          />
        </Col>
        <Col md={18} xs={24}>
          <div>{steps[current]?.content || NA}</div>
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
          {` · ${getProposalVerificationStatus()} · Date: ${proposedDate}`}
        </Text>
      </div>
    </Card>
  );
};

Proposal.propTypes = { proposal: ProposalPropTypes };

Proposal.defaultProps = { proposal: {} };
