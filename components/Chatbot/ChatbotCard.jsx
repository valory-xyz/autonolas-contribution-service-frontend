import { MessageOutlined } from '@ant-design/icons';
import {
  Button,
  Card, Col, Row, Typography,
} from 'antd/lib';
import Image from 'next/image';
import Link from 'next/link';

const { Text, Title } = Typography;

const ChatbotCard = () => (
  <Card>
    <Row gutter={24} align="middle">
      <Col span={10}>
        <Image src="/images/chatbot.png" width={300} height={300} />
      </Col>
      <Col span={14}>
        <Title level={5}>Olas Chatbot</Title>
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
