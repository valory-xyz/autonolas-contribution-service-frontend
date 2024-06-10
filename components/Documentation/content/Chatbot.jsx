import { Typography } from 'antd';
import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph } = Typography;

export const Chatbot = () => (
  <div id={DOCS_SECTIONS.chatbot}>
    <Title level={2}>Chatbot</Title>
    <Paragraph>
      Chatbot enables anybody to learn about Olas through a familiar chat
      experience.
    </Paragraph>
    <Paragraph>
      To use Chatbot, users must have an OpenAI API key with a payment card on
      file. You can sign up for one
      {' '}
      <a
        href="https://platform.openai.com/signup"
        rel="noopener noreferrer"
        target="_blank"
      >
        here
      </a>
      .
    </Paragraph>

    <br />
    <br />
    <br />
  </div>
);
