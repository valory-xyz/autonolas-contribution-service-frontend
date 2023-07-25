/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useState,
  // useEffect,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSignMessage } from 'wagmi';
import { uuid } from 'uuidv4';
import {
  Button, Modal, Input, Typography, Form, Table, Space,
} from 'antd/lib';
import { PlusOutlined } from '@ant-design/icons';
import { setMemoryDetails } from 'store/setup/actions';
import { getMemoryDetails, updateMemoryDetails } from 'common-util/api';
import { InnovataursCard } from 'components/InnovataursCard';
import { notifyError } from 'common-util/functions';
import { OLAS_CENTAUR_ID } from 'util/constants';
import { emptyCentaur } from 'common-util/emptyCentaur';
// import data from './data.json';
import { WelcomeToCentaur } from './WelcomeToCentaur';
import { CentaurPageBody } from './styles';

const { Text } = Typography;

export const Centaurs = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const account = useSelector((state) => state?.setup?.account);
  const list = useSelector((state) => state?.setup?.memoryDetails || []);
  const centaurList = process.env.NEXT_PUBLIC_IS_ALPHA === 'true'
    ? list
    : list.filter((centaur) => centaur.id === OLAS_CENTAUR_ID);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { signMessage } = useSignMessage({
    message: 'Sign this message to verify ownership over this address.',
    onSettled: async (_data, error) => {
      if (error) {
        console.error(error);
        notifyError('Some error occured while signing the message');
      } else {
        const values = form.getFieldsValue();
        const action = {
          actorAddress: account,
          description: 'created the centaur',
          timestamp: Date.now(),
        };
        const newCentaurId = uuid();
        const newCentaur = {
          ...emptyCentaur,
          id: newCentaurId,
          name: values.name,
          purpose: values.purpose,
          // also add the current logged user as a member
          members: [{ address: account, ownership: 0 }],
          actions: [action],
        };

        // Update the Ceramic stream with the new centaur
        await updateMemoryDetails([...centaurList, newCentaur]);

        // refetch the data
        const { response } = await getMemoryDetails();
        dispatch(setMemoryDetails(response));

        // stop loading & reset the state
        setOpen(false);

        router.push(`/centaur/${newCentaurId}`);
      }
      setLoading(false);
    },
  });

  const showModal = () => {
    setOpen(true);
  };

  // (ONLY FOR TESTING) to update with dummy data
  // useEffect(async () => {
  // await updateMemoryDetails(data);
  // }, []);

  // (ONLY FOR TESTING) to update with dummy data
  // const handleDelete = async (id) => {
  //   const updatedCentaurs = centaurList.filter((centaur) => centaur.id !== id);
  //   await updateMemoryDetails(updatedCentaurs);
  //   const { response } = await getMemoryDetails();
  //   dispatch(setMemoryDetails(response));
  // };

  const handleOk = () => {
    form
      .validateFields()
      .then(async () => {
        setLoading(true);
        signMessage(); // sign message before creating the centaur
      })
      .catch((info) => {
        window.console.log('Validate failed:', info);
      });
  };

  const handleCancel = () => {
    setOpen(false);
    setLoading(false);
  };

  return (
    <CentaurPageBody className="bg-shaded p-24">
      {process.env.NEXT_PUBLIC_IS_ALPHA === 'true' && (
        <>
          <Button type="primary" onClick={showModal} className="mb-16 mt-12">
            <PlusOutlined />
            &nbsp;Create Centaur (Free)
          </Button>

          {open && (
            <Modal
              visible={open}
              title="Create Centaur"
              onOk={handleOk}
              onCancel={handleCancel}
              confirmLoading={loading}
              okButtonProps={{ disabled: !account }}
              okText={(
                <>
                  <PlusOutlined />
                  &nbsp;Create
                </>
              )}
              cancelText="Cancel"
            >
              <Form layout="vertical" form={form} onFinish={handleOk}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input name of the centaur',
                    },
                  ]}
                >
                  <Input placeholder="e.g. Alter Orbis Loreteller" />
                </Form.Item>

                <Form.Item
                  label={(
                    <Space>
                      <span>Purpose</span>
                      <Text type="secondary">
                        What do you want to achieve with your centaur?
                      </Text>
                    </Space>
                  )}
                  name="purpose"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the purpose of your centaur',
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={5}
                    placeholder="e.g. Spread knowledge about the history of Alter Orbis."
                  />
                </Form.Item>
              </Form>
              <Text type="secondary">
                There is no gas cost to create a centaur.
              </Text>
            </Modal>
          )}
        </>
      )}

      <Table
        bordered
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 300,
            render: (name, row) => (
              <Link href={`/centaur/${row.id}`}>
                <a>{name}</a>
              </Link>
            ),
          },
          {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            render: (purpose) => <Text>{purpose}</Text>,
          },
          {
            title: 'Members',
            dataIndex: 'members',
            key: 'members',
            width: 200,
            render: (members) => members?.length || 0,
          },
        ].filter(Boolean)}
        dataSource={centaurList}
        pagination={false}
        rowKey="id"
      />

      {process.env.NEXT_PUBLIC_IS_ALPHA === 'false' ? (
        <div className="mt-12">
          <Text type="secondary">
            Want to create your own centaur?
            {' '}
            <a href="https://alpha.launchcentaurs.com">Visit Centaurs Alpha</a>
          </Text>
        </div>
      ) : (
        <div className="mt-12">
          <InnovataursCard />
        </div>
      )}
      <WelcomeToCentaur />
    </CentaurPageBody>
  );
};
