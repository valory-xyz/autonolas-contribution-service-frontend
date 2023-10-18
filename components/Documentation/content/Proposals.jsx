import { Typography } from 'antd/lib';
import Link from 'next/link';
import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph } = Typography;

const Proposals = () => (
  <div id={DOCS_SECTIONS.proposals}>
    <Title level={2}>Proposals</Title>
    <Paragraph>
      Once a tweet is proposed, other members can vote on it. All proposals can
      be reviewed on the
      {' '}
      <Link href="/tweet">Tweet</Link>
      {' '}
      page. To be posted, a
      quorum of 2 million veOLAS must be reached. For example, if there are 10
      users each with 200k veOLAS, and they collectively vote, they can reach
      the 2 million veOLAS quorum required to post the tweet.
    </Paragraph>

    <br />
    <br />
    <br />
  </div>
);

export default Proposals;
