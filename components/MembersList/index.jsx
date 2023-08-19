import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSignMessage } from 'wagmi';
import { useRouter } from 'next/router';
import {
  Table, Typography, Button, notification, Card,
} from 'antd/lib';
import { MessageOutlined, UserAddOutlined } from '@ant-design/icons';
import { areAddressesEqual, notifyError } from 'common-util/functions';
import TruncatedEthereumLink from 'common-util/TruncatedEthereumLink';
import { useCentaursFunctionalities } from 'components/CoOrdinate/Centaur/hooks';
import { cloneDeep } from 'lodash';
import { fetchVeolasBalance } from './requests';

const { Text } = Typography;

const whitelist = [
  '0xb74ff68ec165E221aB15CE58cF23AcAc39F60500',
  '0xF14a7f5b356c655C1F3A0C1367b8342Ae184b597',
  '0x8d188364ac072c634f6F9F6FC7AB6359180935C3',
  '0x0Ac982599606EbD6AaBF2e31CbD8f5BA759ccbbf',
  '0xf33BB476529e93Bb862262f6C6D8Cc324741d7aA',
  '0xE80786df041a06F9257B670553a8A1436Aa3AF3C',
  '0xABF16C2020854371712f371FA0c842c87f7b06d1',
  '0xD0ab906f699F565aF378F3206C82B2D6f355b2c7',
  '0xC523433AC1Cc396fA58698739b3B0531Fe6C4268',
  '0x3A49d95bb764d8F967369d3F40174F36195B0b3f',
  '0x6f0B423faCe9A850c106B0CaAf7c1eb3290015E4',
  '0x6CF807bb1dEE8E2D4C55E8Cf6C875544edB2fCFe',
  '0x6e7f1C44Cc4DD5244B8892aBB51B3d5d6e671a07',
  '0xAFEF760203A59e46c18FC7B8AEFB4E8f47311C3B',
  '0x0b4cc62287F57AD556179D68D556e294C3139946',
  '0x2b5381A4b7f9a57235d4490271A7081B493F5a0e',
  '0xc8Aceae938E53f731cEE4E048f255490C39AaB79',
  '0xb821A10799CA377424A35F9016fa9F410e8A54a9',
  '0xD76f4977087f2067003E5Bf805508292E210e497',
  '0x1D381bfE81Ef92B77002102352fB60e338B2f8b6',
  '0x1801292A0fE7C321ae9aD96EAdA8f735E79EF123',
  '0x7865658E09c31f44eb6154368144b57428B9931b',
  '0xce08bcFA45187d90Fe67E36B75A28A1b0c4E0cf9',
  '0x8583A529f3F531f624D10a32393cfc89B1BfC2f6',
  '0x3CA34bA21236459E19F198c2bAD41239b17EE7F1',
  '0x4cfF1A9c58D87Aa5E12F713D179D60755101e377',
  '0x98e9586103F2A7f97B69912de041A657CA05ca73',
  '0xfd667584d142163d11767AEd747602274FEA05FE',
  '0x89eb68B5c1CB31eB34d07aC6B10d722E2340809D',
  '0xFdBf4F63E3d8a34B2C02492A33422C6C9EB59f61',
  '0xC2c7A52AFC863F2a6f10371886B3cCC53cA43789',
  '0xdf2F907c1B71262A2629EEc59a19178aE96ba1B4',
  '0xD3E9b15C7dF65b2f40e56a2c0D7515afe226dF03',
  '0xcF9430ccC77602ED91cFAac20B218bb74c48f898',
  '0x5F2B528304E5C337f48100E4a1fF5B83E5abe9f2',
  '0xCf5FD1041b4913e83246C607d22355a52b9d6d90',
  '0x646bcae5D25a21cB452bFCd8BaD01008082c8BFC',
  '0x36cF6b9c4c4266097CDa75a0E8354Ef11882110a',
  '0x92e4E69ea99c42337c3ea70a9B6aa1b6c91ba5E2',
  '0x6F2cb76b7F6a165d612aFb452D5c536FefEf61D9',
  '0xF8b9762BEF1A80c1e84EFDd72E782E5A92CdfB84',
  '0xC2c7A52AFC863F2a6f10371886B3cCC53cA43789',
  '0xdf2F907c1B71262A2629EEc59a19178aE96ba1B4',
  '0xD3E9b15C7dF65b2f40e56a2c0D7515afe226dF03',
  '0xfd667584d142163d11767AEd747602274FEA05FE',
  '0x89eb68B5c1CB31eB34d07aC6B10d722E2340809D',
  '0xFdBf4F63E3d8a34B2C02492A33422C6C9EB59f61',
  '0xDdB1219881502a3Ed26441a79bC02F1f5A4F03C0',
  '0xEE10aE1b6726ACaB867B831Ee0F5daD5328C5edC',
  '0x65d12384761bFE6cdaCF1169c3b7333B6eab42B2',
  '0x8daEd1C8233547aD869fce7A80cd5bd6E89b4826',
  '0x26D8BD22C1B3cE53D6C5110c71138749f4c69439',
  '0xAe09159C02C7DD954F42Edec25c602DA2776256b',
];

export const MembersList = () => {
  const router = useRouter();
  const [joinLoading, setJoinLoading] = useState(false);
  const account = useSelector((state) => state?.setup?.account);
  const {
    membersList, currentMemoryDetails, updateMemoryWithNewCentaur, fetchedUpdatedMemory,
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
    if ((Number(balance) === 0) && !whitelist.includes(account)) {
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
    <Card
      title="List"
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
      <Table
        columns={columns}
        dataSource={membersList}
        pagination={false}
        rowKey="address"
        bordered
      />
    </Card>
  );
};

export default MembersList;
