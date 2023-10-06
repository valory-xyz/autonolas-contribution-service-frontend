import { Typography } from 'antd/lib';
import Link from 'next/link';
import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph } = Typography;

const Tweet = () => (
  <div id={DOCS_SECTIONS.tweet}>
    <Title level={2}>Tweet</Title>
    <Paragraph>
      Members have the unique ability to write and propose new tweets to be
      posting from the
      {' '}
      <a href="https://twitter.com/autonolas">Olas Twitter account</a>
      . This
      puts the community in control of the narrative and a key piece of the
      brand.
    </Paragraph>

    <Paragraph>
      First, become a
      {' '}
      <Link href="#members">member</Link>
      . Then head to the
      {' '}
      <Link href="/tweet">Tweet</Link>
      {' '}
      page. Write your tweet and propose it.
      Other members will vote on it. If the proposed tweet gets enough voting power, it will
      be posted.
    </Paragraph>

    <Paragraph>
      Voting power is measured in veOLAS. OLAS holders lock veOLAS in order to
      be able to participate in Contribute, DAO voting and service donations.
      {' '}
      <a
        href="https://member.olas.network"
        rel="noopener noreferrer"
        target="_blank"
      >
        Get veOLAS
      </a>
      .
    </Paragraph>

    <br />
    <br />
    <br />
  </div>
);

export default Tweet;
