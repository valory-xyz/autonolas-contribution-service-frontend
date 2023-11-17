import { MessageOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import {
  Button, Card, Col, Row, Typography,
} from 'antd';

import { EducationTitle } from 'common-util/Education/EducationTitle';

const { Text } = Typography;

const ChatbotCard = () => (
  <Card>
    <Row gutter={24} align="middle">
      <Col span={10}>
        <Image src="/images/chatbot.png" width={225} height={225} />
      </Col>
      <Col span={14}>
        <EducationTitle
          title="Olas Chatbot"
          educationItem="chatbot"
          level={5}
        />
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
