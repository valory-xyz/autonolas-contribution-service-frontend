import { MessageOutlined } from '@ant-design/icons';
import { Button, Card, Col, Image, Row, Typography } from 'antd';
import Link from 'next/link';

import { EducationTitle } from 'common-util/Education/EducationTitle';

const { Text } = Typography;

const ChatbotCard = () => (
  <Card>
    <Row gutter={24} align="middle">
      <Col span={10}>
        <Image src="/images/chatbot.png" alt="chat bot" />
      </Col>
      <Col span={14}>
        <EducationTitle title="Olas Chatbot" educationItem="chatbot" level={5} />
        <Text type="secondary" className="text-center">
          AI-powered chatbot for learning about Olas. Member-managed memory.
        </Text>
        <br />
        <br />
        <Link href="/chatbot">
          <Button>
            <MessageOutlined />
            Start chatting
          </Button>
        </Link>
      </Col>
    </Row>
  </Card>
);

export default ChatbotCard;
