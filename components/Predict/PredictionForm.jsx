import React, { useState } from 'react';
import {
  Form, Input, Button, DatePicker,
} from 'antd/lib';
import axios from 'axios';
import { uuid } from 'uuidv4';
import { notifyError, notifySuccess } from 'common-util/functions';
import { setPredictionRequests } from 'store/setup/actions';
import { getPredictionRequests } from 'common-util/api/predictionRequests';
import { useDispatch } from 'react-redux';
import { PREDICT_BASE_URL, PREDICT_REQUEST_ENDPOINT } from 'util/constants';

const { TextArea } = Input;

const PredictionForm = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

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
      await axios.post(PREDICT_BASE_URL + PREDICT_REQUEST_ENDPOINT, payload, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_PREDICT_API_KEY,
          'Content-Type': 'application/json',
        },
      });
      const predictionRequests = await getPredictionRequests();
      dispatch(setPredictionRequests(predictionRequests));
      notifySuccess('Prediction requested');
    } catch (error) {
      notifyError('Request failed');
      console.error(error);
    } finally {
      form.resetFields();
      setIsLoading(false);
    }
  };

  return (
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
        label="Resolution time"
        name="resolution_time"
        extra="This is when you receive your answer"
        rules={[{ required: true, message: 'Please pick the resolution time' }]}
      >
        <DatePicker showTime />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Request
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PredictionForm;
