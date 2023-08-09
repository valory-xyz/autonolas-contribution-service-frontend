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
      quorum of two thirds must be reached. So if there are 30 members, 20 must
      vote for it in order for it to be posted.
    </Paragraph>

    <br />
    <br />
    <br />
  </div>
);

export default Proposals;
