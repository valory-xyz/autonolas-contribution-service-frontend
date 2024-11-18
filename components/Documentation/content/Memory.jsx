import { Typography } from 'antd';
import Link from 'next/link';

import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph } = Typography;

export const Memory = () => (
  <div id={DOCS_SECTIONS.memory}>
    <Title level={2}>Memory</Title>
    <Paragraph>
      Members collectively manage Chatbot&apos;s memory. Members can keep it up to date, give it a
      personality, and make it more useful.
    </Paragraph>

    <Paragraph>
      First, become a <Link href="#members">member</Link>. Then head to{' '}
      <Link href="/chatbot">Chatbot</Link> and hit Edit Memory. Here you can add new items, edit
      existing items, and delete items. Whatever you change will be reflected when users speak to
      Chatbot.
    </Paragraph>

    <br />
    <br />
    <br />
  </div>
);
