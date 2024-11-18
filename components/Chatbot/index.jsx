import { SendOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Col, Drawer, Input, List, Row, Space } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { notifyError, notifySuccess } from '@autonolas/frontend-library';

import { EducationTitle } from 'common-util/Education/EducationTitle';

import { useCentaursFunctionalities } from '../CoOrdinate/Centaur/hooks';
import MemoryCard from '../MemoryCard';
import { ApiKeyModal } from './ApiKeyModal';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const Chatbot = ({ name }) => {
  const [apiKey, setApiKey] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const apiKeyModalRef = useRef(null);
  const { currentMemoryDetails } = useCentaursFunctionalities();

  const { memory } = currentMemoryDetails;

  const isSendButtonDisabled = (memory || []).length === 0;

  useEffect(() => {
    // flatten memory array into a string to send to OpenAI
    const flattenedMemory = memory?.join('\n');
    setMessages([{ role: 'system', content: flattenedMemory }]);

    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, [memory]);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('openai_api_key', apiKey);
    notifySuccess('API Key saved.');
    apiKeyModalRef.current?.handleCancel();
  };

  const handleSendMessage = async () => {
    if (isSendButtonDisabled) {
      return;
    }

    if (!apiKey) {
      notifyError('Please provide your OpenAI API key.');
      return;
    }

    if (inputMessage.trim() === '') {
      notifyError('Please enter a message.');
      return;
    }

    const newMessage = { role: 'user', content: inputMessage };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');
    setLoading(true);

    const messagesForApi = [...messages, newMessage];

    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          max_tokens: 1500,
          model: 'gpt-3.5-turbo',
          messages: messagesForApi,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      const completionContent = response.data.choices[0].message.content.trim();
      const completionRole = response.data.choices[0].message.role;

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: completionRole, content: completionContent },
      ]);
    } catch (error) {
      console.error(error);
      notifyError('Error sending the message. Please check your API key and try again.');
    } finally {
      setInputMessage('');
      setLoading(false);
    }
  };

  return (
    <Row>
      <Col xs={24} md={12}>
        <Card
          title={<EducationTitle title="Chatbot" educationItem="chatbot" />}
          extra={<Button onClick={() => setDrawerOpen(true)}>Edit memory</Button>}
        >
          <Space direction="vertical" className="chatbot-body-container">
            <Input
              placeholder="Enter message"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onPressEnter={handleSendMessage}
            />

            <Space>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={isSendButtonDisabled}
                loading={loading}
              >
                Send
              </Button>
              <Button
                type="dashed"
                icon={<SettingOutlined />}
                onClick={() => apiKeyModalRef.current?.handleOpen()}
              >
                Set API Key
              </Button>
            </Space>
            <List
              locale={{
                emptyText: `Send your first message${name ? ` to ${name}` : ''}!`,
              }}
              dataSource={messages
                .filter((e) => e.role !== 'system')
                .reverse()
                .map((e) => {
                  // change the user text to "You"
                  if (e.role === 'user') {
                    return { ...e, role: 'You' };
                  }
                  if (e.role === 'assistant') {
                    return { ...e, role: 'Bot' };
                  }
                  return e;
                })}
              renderItem={(item) => (
                <List.Item className={item.role === 'You' ? 'bot-chat' : ''}>
                  <List.Item.Meta
                    title={item.role}
                    description={<ReactMarkdown>{item.content}</ReactMarkdown>}
                  />
                </List.Item>
              )}
            />

            <ApiKeyModal
              ref={apiKeyModalRef}
              apiKey={apiKey}
              onChange={handleApiKeyChange}
              onSave={handleSaveApiKey}
            />
          </Space>
          <Drawer
            placement="right"
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
            size="large"
          >
            <MemoryCard />
          </Drawer>
        </Card>
      </Col>
    </Row>
  );
};

Chatbot.propTypes = {
  name: PropTypes.string,
};

Chatbot.defaultProps = {
  name: null,
};

export default Chatbot;
