import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useSignMessage } from 'wagmi';
import { useRouter } from 'next/router';
import {
  Table, Typography, Button, notification, Card, Alert,
} from 'antd/lib';
import { UserAddOutlined } from '@ant-design/icons';
import { areAddressesEqual, notifyError } from 'common-util/functions';
import TruncatedEthereumLink from 'common-util/TruncatedEthereumLink';
import { fetchVeolasBalance } from './requests';

const { Title, Text } = Typography;

export const Members = ({ members, addNewMember, memberWhitelist }) => {
  const router = useRouter();
  const [joinLoading, setJoinLoading] = useState(false);
  const account = useSelector((state) => state?.setup?.account);

  const { signMessage } = useSignMessage({
    message: 'Sign this message to verify ownership over this address.',

    onSettled: async (_data, error) => {
      if (error) {
        console.error(error);
        notifyError('Some error occured while signing the message');
      } else {
        await addNewMember();
      }
      setJoinLoading(false);
    },
  });

  const onJoin = async () => {
    setJoinLoading(true);
    const balance = await fetchVeolasBalance({ account });
    if (Number(balance) === 0) {
      notifyError('You need to have veOlas to join');
      setJoinLoading(false);
    } else {
      signMessage();
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
    // {
    //   title: 'Ownership',
    //   dataIndex: 'ownership',
    //   width: 180,
    //   render: (text) => <>{`${text}%`}</>,
    //   align: 'right',
    // },
    {
      title: 'Actions',
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
                Chat
              </Button>
            )}
          </>
        );
      },
      align: 'right',
    },
  ];

  const isMemberPresent = members.some((member) => areAddressesEqual(member.address, account));

  return (
    <Card
      title={<Title level={4}>Members</Title>}
      bodyStyle={{ padding: 10 }}
      extra={[
        !isMemberPresent && (
          <Button
            type="primary"
            className="mr-12"
            disabled={!account}
            loading={joinLoading}
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
      {memberWhitelist?.length > 0 && (
        <Alert
          className="mb-12"
          message="Whitelist enabled: see members below"
          type="info"
          closable
        />
      )}
      <Table
        columns={columns}
        dataSource={members}
        pagination={false}
        rowKey="address"
        bordered
      />
    </Card>
  );
};

Members.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string,
      ownership: PropTypes.number,
    }),
  ),
  addNewMember: PropTypes.func,
  memberWhitelist: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Members.defaultProps = {
  members: [],
  addNewMember: () => {},
};
