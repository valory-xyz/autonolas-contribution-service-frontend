import React, { useState } from 'react';
import {
  Form, Input, Button, DatePicker, Modal, Alert,
} from 'antd';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { notifyError, notifySuccess } from '@autonolas/frontend-library';

import { setApprovedRequestsCount } from 'store/setup';
import {
  getPredictionRequests,
  postPredictionRequest,
} from 'common-util/api/predictionRequests';

import { checkVotingPower } from '../MembersList/requests';
import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';

const { TextArea } = Input;

const PredictionForm = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isAddressPresent } = useCentaursFunctionalities();

  const dispatch = useDispatch();

  const account = useSelector((state) => state?.setup?.account);

  const handleSubmit = async (values) => {
    setIsLoading(true);

    // Check if the user has a connected wallet
    if (!account) {
      notifyError('Connect your wallet to ask questions');
      setIsLoading(false);
      return;
    }

    // Check if the connected address is a member
    if (!isAddressPresent) {
      notifyError('Join Contribute to ask questions');
      setIsLoading(false);
      return;
    }

    const thresholdIsMet = checkVotingPower(
      account,
      '5000000000000000000000',
    );

    if (!thresholdIsMet) {
      notifyError('Get at least 5k veOLAS to ask questions');
      setIsLoading(false);
      return;
    }

    const payload = {
      id: uuid(),
      language: 'en_US',
      source: 'contribute',
      question: values.question,
      resolution_time: values.resolution_time.unix(),
      topic: 'olas',
      answers: ['Yes', 'No'],
    };

    try {
      await postPredictionRequest(payload);

      const { approvedRequestsCount } = await getPredictionRequests();
      dispatch(setApprovedRequestsCount(approvedRequestsCount));

      notifySuccess('Question asked');
      form.resetFields();
    } catch (error) {
      notifyError('Request failed');
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Ask a question
      </Button>
      <Modal
        title="Ask a question"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Alert className="mb-12" type="info" showIcon message={<Link href="/docs#predict">Learn how to ask a good question</Link>} />
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Question"
            name="question"
            extra="Questions must expect a yes/no answer"
            rules={[{ required: true, message: 'Please input a question' }]}
          >
            <TextArea />
          </Form.Item>

          <Form.Item
            label="Final answer date"
            name="resolution_time"
            extra="When will it be possible to definitively answer the question?"
            rules={[
              { required: true, message: 'Please pick the final answer date' },
            ]}
          >
            <DatePicker showTime />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Ask
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PredictionForm;
