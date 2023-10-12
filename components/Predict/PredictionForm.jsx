import React, { useState } from 'react';
import {
  Form, Input, Button, DatePicker, Modal,
} from 'antd/lib';
import { v4 as uuid } from 'uuid';
import { notifyError, notifySuccess } from 'common-util/functions';
import { setApprovedRequestsCount } from 'store/setup/actions';
import { getPredictionRequests, postPredictionRequest } from 'common-util/api/predictionRequests';
import { useDispatch } from 'react-redux';

const { TextArea } = Input;

const PredictionForm = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    setIsLoading(true);

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
      <Modal title="Ask a question" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
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
            label="Closing date"
            name="resolution_time"
            rules={[{ required: true, message: 'Please pick the closing date' }]}
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
