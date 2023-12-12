import React, { useState } from 'react';
import {
  Button, Modal, Form, Input, Tooltip,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import useOrbis from 'common-util/hooks/useOrbis';

export const UpdateUsername = ({ loadOrbisProfile, id }) => {
  const [updateNameModalVisible, setUpdateNameModalVisible] = useState(false);
  const {
    updateUsername, address: orbisAddress, isLoading, profile,
  } = useOrbis();
  const [form] = Form.useForm();

  const handleUpdateUsername = async (values) => {
    const result = await updateUsername(values.username.trim());

    loadOrbisProfile();
    form.resetFields();
    setUpdateNameModalVisible(false);
    return result;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await handleUpdateUsername(values);
    } catch (info) {
      console.error('Validate failed:', info);
    }
  };

  const isIdAndOrbisProfileMatch = areAddressesEqual(id, orbisAddress);

  return (
    <>
      <Tooltip title={!isIdAndOrbisProfileMatch ? 'To update, you must be signed in to Orbis with the owner wallet' : ''}>
        <Button className="mb-24" onClick={() => setUpdateNameModalVisible(true)} disabled={!isIdAndOrbisProfileMatch}>
          <EditOutlined />
          {' '}
          Update name
        </Button>
      </Tooltip>
      <Modal
        title="Update username"
        open={updateNameModalVisible}
        onOk={handleSubmit}
        onCancel={() => setUpdateNameModalVisible(false)}
        okButtonProps={{ loading: isLoading }}
      >
        <Form
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
