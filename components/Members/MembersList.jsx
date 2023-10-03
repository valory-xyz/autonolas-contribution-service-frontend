import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useSignMessage } from 'wagmi';
import { cloneDeep } from 'lodash';
import {
  Table, Typography, Button, notification, Card, Alert,
} from 'antd/lib';
import { MessageOutlined, UserAddOutlined } from '@ant-design/icons';

import {
  areAddressesEqual,
  notifyError,
  notifySuccess,
} from 'common-util/functions';
import TruncatedEthereumLink from 'common-util/TruncatedEthereumLink';
import { useCentaursFunctionalities } from 'components/CoOrdinate/Centaur/hooks';
import { fetchVeolasBalance } from './requests';

const { Text } = Typography;

export const MembersList = () => {
  const router = useRouter();
  const [isJoinLoading, setIsJoinLoading] = useState(false);
  const account = useSelector((state) => state?.setup?.account);
  const {
    membersList,
    currentMemoryDetails,
    updateMemoryWithNewCentaur,
    fetchedUpdatedMemory,
  } = useCentaursFunctionalities();

  const addNewMember = async () => {
    const newMember = { address: account, ownership: 0 };
    const updatedMembers = [...(membersList || []), newMember];
    // update the members
    const updatedCentaur = cloneDeep(currentMemoryDetails);
    updatedCentaur.members = updatedMembers;

    // Update the Ceramic stream
    // const commitId = await updateMemoryWithNewCentaur(updatedCentaur);
    await updateMemoryWithNewCentaur(updatedCentaur);
    notification.success({ message: 'Joined centaur' });

    // Add action to the centaur
    // const action = {
    //   actorAddress: account,
    //   commitId,
    //   description: 'joined the centaur',
    //   timestamp: Date.now(),
    // };

    await fetchedUpdatedMemory();
    // Commenting out until fixed
    // await triggerAction(centaurId, action);
  };

  const { signMessageAsync: signMessage, isError: isJoinError } = useSignMessage({
    message: 'Sign this message to verify ownership over this address.',
    onSettled: async (_data, error) => {
      if (error) {
        console.error(error);
        notifyError(
          error.details || 'Some error occured while signing the message',
        );
      } else {
        notifySuccess('Message signed successfully');
        await addNewMember();
      }
    },
  });

  const checkIfHasVeolas = async () => {
    try {
      const balance = await fetchVeolasBalance({ account });
      const hasBalance = Number(balance) > 0;
      if (!hasBalance) {
        notifyError(
          <>
            You must hold veOLAS to join.&nbsp;
            <a
              href="https://member.olas.network/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get veOLAS
            </a>
          </>,
        );
      }
      return hasBalance;
    } catch (error) {
      notifyError('Error on checking veOLAS balance');
      console.error(error);
      return false;
    }
  };

  const onJoin = async () => {
    try {
      setIsJoinLoading(true);
      const hasVeolas = await checkIfHasVeolas();
      if (hasVeolas) {
        await signMessage();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsJoinLoading(false);
    }
  };

  const columns = [
    {
      title: 'Address',
      dataIndex: 'address',
      width: 160,
      render: (text) => (
        <Text type="secondary">
          <TruncatedEthereumLink text={text} />
          {areAddressesEqual(text, account) && <>&nbsp;(You)</>}
        </Text>
      ),
    },
    {
      dataIndex: 'actions',
      width: 100,
      render: (_text, record) => {
        const isSelf = areAddressesEqual(record.address, account);

        return (
          <>
            {!isSelf && (
              <Button
                disabled={!account}
                onClick={() => {
                  /**
                   * 1. on click => push to different page
                   * 2. get the current user and the selected user
                   * 3. get their conversation id
                   * 4. push to the chat page with the conversation id
                   * 5. get all the conversation messages
                   * 6. display the messages
                   * 7. send messages
                   */
                  router.push({
                    pathname: '/member-chat',
                    query: { address: record.address },
                  });
                }}
              >
                <MessageOutlined />
                {' '}
                Message
              </Button>
            )}
          </>
        );
      },
      align: 'right',
    },
  ];

  const isMemberPresent = membersList.some((member) => areAddressesEqual(member.address, account));

  return (
    <>
      {isJoinError && (
        <Alert
          message="Join failed, please refresh the page and try again."
          type="error"
          className="mb-12"
          showIcon
        />
      )}

      <Card
        title="List"
        bodyStyle={{ padding: 10 }}
        extra={[
          !isMemberPresent && (
            <Button
              type="primary"
              className="mr-12"
              disabled={!account}
              loading={isJoinLoading}
              onClick={onJoin}
            >
              Join
            </Button>
          ),
          <Button
            disabled={!account}
            onClick={() => {
              notification.success({ message: 'Link copied' });
              navigator.clipboard.writeText(document.URL);
            }}
          >
            <UserAddOutlined />
            &nbsp;Invite
          </Button>,
        ]}
      >
        <Table
          columns={columns}
          dataSource={membersList}
          pagination={false}
          rowKey={(record) => record.address}
          bordered
        />
      </Card>
    </>
  );
};

export default MembersList;
