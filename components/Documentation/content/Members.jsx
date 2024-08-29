import Link from 'next/link';
import { Typography } from 'antd';
import { VEOLAS_URL } from 'util/constants';
import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph } = Typography;

export const Members = () => (
  <div id={DOCS_SECTIONS.members}>
    <Title level={2}>Members</Title>
    <Paragraph>
      Becoming a member of Olas Contribute enables you to act for the DAO across
      the app:
      <ul>
        <li>propose and vote on tweets</li>
        <li>manage Chatbot memory</li>
        <li>chat with other members</li>
      </ul>
    </Paragraph>
    <Paragraph>
      To become a member, you need to hold veOLAS. To get veOLAS:
      <ol>
        <li>
          <a
            href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x0001a500a6b18995b03f44bb040a5ffc28e45cb0"
            rel="noopener noreferrer"
            target="_blank"
          >
            Get OLAS
          </a>
        </li>
        <li>
          <a
            href={VEOLAS_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Lock OLAS for veOLAS
          </a>
        </li>
      </ol>
      You need to hold some veOLAS to join as a member. You can join on the
      {' '}
      <Link href="/members">Members</Link>
      {' '}
      page.
    </Paragraph>
    <Paragraph>
      Members are able to participate in group chat and private chat, both
      facilitated by
      {' '}
      <a
        href="https://ceramic.network"
        rel="noopener noreferrer"
        target="_blank"
      >
        Ceramic
      </a>
      {' '}
      and
      {' '}
      <a href="https://orbis.club" rel="noopener noreferrer" target="_blank">
        Orbis
      </a>
      . All member chat functionality can be accessed via the
      {' '}
      <Link href="/members">Members</Link>
      {' '}
      page.
    </Paragraph>

    <br />
    <br />
    <br />
  </div>
);
