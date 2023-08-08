import { Card, Typography } from 'antd/lib';
import Link from 'next/link';

const { Text } = Typography;

const ChatbotCard = () => (
  <Card
    title="Chatbot"
    actions={[<Link href="/chatbot">Learn about Olas</Link>]}
  >
    <Text type="secondary" className="text-center">
      AI-powered chatbot for learning about Olas. The chatbot&apos;s memory is
      collaboratively managed by Contribute members.
    </Text>
  </Card>
);

export default ChatbotCard;
