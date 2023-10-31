import { Typography } from 'antd/lib';
import Link from 'next/link';
import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph, Text } = Typography;

const Predict = () => (
  <div id={DOCS_SECTIONS.predict}>
    <Title level={2}>Predict</Title>
    <Paragraph>
      Contribute&apos;s Predict feature allows members to predict the future of the
      Olas ecosystem. It&apos;s based on Olas&apos; novel AI prediction service.
    </Paragraph>

    <Title level={4}>Asking a question</Title>
    <Paragraph>
      First,
      {' '}
      <Link href="/members">become a member</Link>
      {' '}
      and join Contribute.
      Then head to
      {' '}
      <Link href="/predict">Predict</Link>
      {' '}
      and hit Ask a Question.
    </Paragraph>

    <Paragraph>
      To ask a question you must hold 5k veOLAS. To get veOLAS,
      {' '}
      <a
        href="https://olas.network/olas-token"
        target="_blank"
        rel="noopener noreferrer"
      >
        get OLAS ↗
      </a>
      {' '}
      on Ethereum mainnet and
      {' '}
      <a
        href="https://member.olas.network"
        target="_blank"
        rel="noopener noreferrer"
      >
        lock it ↗
      </a>
      .
    </Paragraph>

    <Paragraph>
      It is important to ask questions in the correct format. Questions should:
    </Paragraph>
    <ul>
      <li>Be concise</li>
      <li>Be related to a tangible and knowable aspect of Olas</li>
      <li>Include a date by which the question has a definitive answer</li>
    </ul>

    <Text strong>👍 Examples of good questions:</Text>
    <ul>
      <li>
        Will the number of Olas (prev Autonolas) services exceed 200 across all
        chains by 10 Nov 2023?
      </li>
      <li>Will the DAO vote AIP-2 in before the end of October 2023?</li>
    </ul>

    <Paragraph>
      Note that both questions are related to a tangible and knowable aspect of
      Olas – i.e. number of services, execution of a named proposal – and
      include a date by which the question has a definitive answer.
    </Paragraph>

    <Text strong>👎 Examples of bad questions:</Text>
    <ul>
      <li>Where is Olas going?</li>
      <li>Will the DAO vote AIP-4 in?</li>
    </ul>

    <Paragraph>
      Note that both questions are not related to a tangible and knowable aspect
      of Olas – i.e. they are not specific enough – and do not include a date by
      which the question has a definitive answer.
    </Paragraph>

    <Paragraph>---</Paragraph>

    <Paragraph>
      You must also add a &quot;Final answer date&quot;. This should be the same as the
      date in your question. This is the point at which, under the hood, the
      prediction market contract will be resolved.
    </Paragraph>

    <Paragraph>
      To learn more about how the backend functionality – relating to Olas
      services, on-chain prediction markets etc – works, see this
      {' '}
      <a
        href="https://hackathon.olas.network/system-overview"
        target="_blank"
        rel="noreferrer"
      >
        system diagram&nbsp;↗
      </a>
      .
    </Paragraph>
    <br />
    <br />
    <br />
  </div>
);

export default Predict;
