import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
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
} from 'antd/lib';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { cloneDeep, set } from 'lodash';
import dayjs from 'dayjs';
import { NA } from '@autonolas/frontend-library';

import DisplayName from 'common-util/DisplayName';
import {
  ethersToWei,
  getNumberInMillions,
  notifyError,
  notifySuccess,
} from 'common-util/functions';
import { ProposalPropTypes } from 'common-util/prop-types';
import { fetchVeolasBalance } from 'components/MembersList/requests';
import { VEOLAS_QUORUM } from 'util/constants';
import {
  useCentaursFunctionalities,
  useProposals,
} from '../CoOrdinate/Centaur/hooks';
import { ViewThread } from '../Tweet/ViewThread';

const { Text } = Typography;

const STEPS = {
  APPROVE: 0,
  EXECUTE: 1,
};
const Proposal = ({ proposal, isAddressPresent }) => {
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isExecuteLoading, setIsExecuteLoading] = useState(false);
  const [current, setCurrent] = useState(STEPS.APPROVE);

  const account = useSelector((state) => state?.setup?.account);
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
  } = getCurrentProposalInfo(proposal);
  const hasVoted = votersAddress?.includes(account) || false;

  const canMoveToExecuteStep = isExecutable || proposal.posted;

  // set current step
  useEffect(() => {
    if (canMoveToExecuteStep) {
      setCurrent(STEPS.EXECUTE);
    } else {
      setCurrent(STEPS.APPROVE);
    }
  }, [isExecutable, proposal.posted]);

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

      // Check if the user has at least 1 veOlas
      const accountVeOlasBalance = await fetchVeolasBalance({ account });
      if (ethers.BigNumber.from(accountVeOlasBalance).lte(ethersToWei('1'))) {
        notifyError('You need at least 1 veOLAS to vote');
        return;
      }

      // Update proposal with the new voter & their veOlas balance
      const updatedProposal = cloneDeep(proposal);
      const updatedVotersWithVeOlas = [
        ...(proposal.voters || []),
        { [account]: accountVeOlasBalance },
      ];
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
      console.error(error);
    } finally {
      if (isExecutable) {
        setIsApproveLoading(false);
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
            disabled={!account || !isAddressPresent}
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
          <Popconfirm
            title="Are you sure？This will immediately post to the @autonolas Twitter account."
            icon={<ExclamationCircleOutlined style={{ color: 'orange' }} />}
            onConfirm={onExecute}
          >
            <Button
              ghost
              type="primary"
              loading={isExecuteLoading}
              disabled={!isAddressPresent || !account || !isExecutable}
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
    setCurrent(value === 0 ? STEPS.APPROVE : STEPS.EXECUTE);
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
