// TODO: deprecated?
import { EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Address } from 'viem';

import { areAddressesEqual } from '@autonolas/frontend-library';

import useOrbis from 'common-util/hooks/useOrbis';

type UpdateUsernameProps = {
  loadOrbisProfile: (value: true) => Promise<void>;
  id: Address;
};

type FormValues = {
  username: string;
};

export const UpdateUsername = ({ loadOrbisProfile, id }: UpdateUsernameProps) => {
  const [updateNameModalVisible, setUpdateNameModalVisible] = useState(false);
  const { updateUsername, address: orbisAddress, isLoading, profile } = useOrbis();
  const [form] = Form.useForm();

  const handleUpdateUsername = async (values: FormValues) => {
    const result = await updateUsername(values.username.trim());

    form.resetFields();
    setUpdateNameModalVisible(false);
    return result;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const result = await handleUpdateUsername(values);
      if (result) {
        await loadOrbisProfile(true);
      }
    } catch (info) {
      console.error('Validate failed:', info);
    }
  };

  const isIdAndOrbisProfileMatch = areAddressesEqual(id, orbisAddress);

  return (
    <>
      <Tooltip
        title={
          !isIdAndOrbisProfileMatch
            ? 'To update, you must be signed in to Orbis with the owner wallet'
            : ''
        }
      >
        <Button
          className="mb-24"
          onClick={() => setUpdateNameModalVisible(true)}
          disabled={!isIdAndOrbisProfileMatch}
        >
          <EditOutlined /> Update name
        </Button>
      </Tooltip>
      <Modal
        title="Update username"
        open={updateNameModalVisible}
        onOk={handleSubmit}
        onCancel={() => setUpdateNameModalVisible(false)}
        okButtonProps={{ loading: isLoading }}
      >
        <Form<FormValues>
          form={form}
          layout="vertical"
          initialValues={{ username: profile?.username }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your new username!' }]}
          >
            <Input placeholder="Enter new username" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

UpdateUsername.propTypes = {
  id: PropTypes.string.isRequired,
  loadOrbisProfile: PropTypes.func.isRequired,
};
