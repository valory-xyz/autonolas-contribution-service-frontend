/* eslint-disable react/no-unescaped-entities */
import { Typography } from 'antd/lib';
import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph } = Typography;

const ActionsDocs = () => (
  <div id={DOCS_SECTIONS.actions}>
    <Title level={2}>Actions</Title>
    <Paragraph>
      Actions are tasks that are designed by the DAO to maximize impact for
      Olas&apos; success. When community members complete actions, they
      contribute to the DAO&apos;s progress.
    </Paragraph>

    <Paragraph>
      Currently, there is one action: "Spread the word on Twitter". To complete
      this, you must first connect to Twitter – you can do this via the
      Leaderboard page. Once connected, tweet about Olas being sure to either
      mention @autonolas, or use the hashtag #OlasNetwork. In the background, an
      AI-powered Olas service will analyse your tweet based on quality and
      relevance, and you'll be rewarded accordingly.
    </Paragraph>
    <br />
    <br />
    <br />
  </div>
);

export default ActionsDocs;
