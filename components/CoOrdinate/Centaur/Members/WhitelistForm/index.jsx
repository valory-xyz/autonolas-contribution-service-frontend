/* eslint-disable-next-line import/no-extraneous-dependencies */
import Web3 from 'web3';
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Form, Input, Button, notification,
} from 'antd/lib';
import { updateMemoryDetails } from 'common-util/api';
import { useSelector } from 'react-redux';
import { CentaurPropTypes } from 'common-util/prop-types';

const addMemberToWhitelist = (centaur, member) => {
  // If .configuration doesn't exist, create an empty object
  const existingConfiguration = centaur?.configuration || {};

  // Create a new configuration object
  const newConfiguration = {
    ...existingConfiguration,
    memberWhitelist: [...(existingConfiguration.memberWhitelist || []), member],
  };

  // Return a new centaur object with the updated configuration
  return {
    ...centaur,
    configuration: newConfiguration,
  };
};

const WhitelistForm = ({
  currentCentaur,
  centaursList,
  centaurId,
  isPermitted,
}) => {
  const account = useSelector((state) => state?.setup?.account);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);

    try {
      const newCentaur = addMemberToWhitelist(currentCentaur, values.member);

      // Save the updated centaur in memory
      const updatedCentaur = centaursList.map((centaur) => {
        if (centaur.id === centaurId) {
          return newCentaur;
        }
        return centaur;
      });

      // Update the Ceramic stream
      await updateMemoryDetails(updatedCentaur);
      notification.success({ message: 'Permitted member' });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      name="memberWhitelist"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        className="mb-16"
        label="Member"
        name="member"
        rules={[
          {
            required: true,
          },
          () => ({
            validator(_, value) {
              if (Web3.utils.isAddress(value)) return Promise.resolve();
              return Promise.reject(new Error('Please input a valid address'));
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!isPermitted || !account}
          loading={isLoading}
        >
          Add to Whitelist
        </Button>
      </Form.Item>
    </Form>
  );
};

WhitelistForm.propTypes = {
  currentCentaur: CentaurPropTypes.isRequired,
  centaursList: PropTypes.arrayOf(CentaurPropTypes).isRequired,
  centaurId: PropTypes.string.isRequired,
  isPermitted: PropTypes.bool.isRequired,
};

export default WhitelistForm;
