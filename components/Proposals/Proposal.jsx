import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Typography, Button, Card, Row, Col, Steps, Result,
} from 'antd/lib';
import { cloneDeep, set } from 'lodash';
import dayjs from 'dayjs';
import { NA } from '@autonolas/frontend-library';

import DisplayName from 'common-util/DisplayName';
import { notifyError, notifySuccess } from 'common-util/functions';
import { ProposalPropTypes } from 'common-util/prop-types';
import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';
import { ViewThread } from '../Tweet/ViewThread';

const { Text } = Typography;

const Proposal = ({ proposal, isAddressPresent }) => {
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isExecuteLoading, setIsExecuteLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  const {
    fetchedUpdatedMemory,
    updateMemoryWithNewCentaur,
    currentMemoryDetails: centaur,
    triggerAction,
  } = useCentaursFunctionalities();
  const account = useSelector((state) => state?.setup?.account);

  const hasVoted = proposal.voters?.includes(account) || false;
  const forVotes = proposal.voters?.length || 0;
  const quorum = Math.ceil((centaur.members.length / 3) * 2);
  const isExecutable = forVotes >= quorum;

  const initStepState = () => {
    if (isExecutable || proposal.posted) {
      setCurrent(1);
    } else {
      setCurrent(0);
    }
  };

  useEffect(() => {
    initStepState();
  }, []);

  const onApprove = async () => {
    if (!isAddressPresent || !account) {
      notifyError(
        'Please connect your wallet and join the coordinate to vote.',
      );
      return;
    }

    if (hasVoted) {
      notifyError('You have already voted for this option.');
      return;
    }

    try {
      setIsApproveLoading(true);

      const updatedVoters = [...(proposal.voters || []), account];
      set(proposal, 'voters', updatedVoters);

      const updatedTweets = centaur?.plugins_data?.scheduled_tweet?.tweets?.map(
        (tweet) => (tweet.request_id === proposal.request_id ? proposal : tweet),
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
      console.error(error);
    } finally {
      setIsApproveLoading(false);
      if (isExecutable) {
        setCurrent(1);
      }
    }
  };

  const onExecute = async () => {
    if (!isAddressPresent || !account) {
      notifyError('To execute, connect your wallet and join the centaur.');
      return;
    }

    if (!isExecutable) {
      notifyError('This proposal needs more approvals to be executed.');
      return;
    }

    try {
      setIsExecuteLoading(true);

      set(proposal, 'execute', true);

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

      <div className="mb-12">
        <Text>
          {`${forVotes} / ${centaur.members.length} members approved · Needs at least ${quorum} approvals to execute`}
        </Text>
      </div>

      {hasVoted ? (
        <Text>✅ You approved</Text>
      ) : (
        <>
          <Button
            ghost
            type="primary"
            onClick={onApprove}
            loading={isApproveLoading}
            disabled={!account || !isAddressPresent}
          >
            Approve this proposal
          </Button>

          {!account && (
            <>
              <br />
              <Text type="secondary">To approve, connect your wallet</Text>
            </>
          )}
        </>
      )}
    </>
  );

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
      {proposal.execute ? (
        <Text>Posting tweet...</Text>
      ) : (
        <>
          <Button
            ghost
            type="primary"
            onClick={onExecute}
            loading={isExecuteLoading}
            disabled={!isAddressPresent || !account || !isExecutable}
            className="mb-12"
          >
            Execute & post tweet
          </Button>
          <br />
          {!isExecutable && (
            <Text text="secondary">
              {`To be executed, this proposal needs ${quorum} approvals. Current approvals: ${forVotes}`}
            </Text>
          )}
        </>
      )}
    </>
  );

  const steps = [
    {
      key: 'approve',
      title: 'Approve',
      content: ApproveStep,
    },
    {
      key: 'execute',
      title: 'Execute',
      content: ExecuteStep,
    },
  ];

  const onChange = (value) => {
    setCurrent(value);
  };

  const proposedDate = proposal?.createdDate
    ? dayjs.unix(proposal.createdDate).format('HH:mm DD/M/YY')
    : '--';

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
          <DisplayName actorAddress={proposal?.proposer} account={account} />
          {` · Date: ${proposedDate}`}
        </Text>
      </div>
    </Card>
  );
};

Proposal.propTypes = {
  proposal: ProposalPropTypes,
  isAddressPresent: PropTypes.bool.isRequired,
};

Proposal.defaultProps = {
  proposal: {},
};

export default Proposal;
