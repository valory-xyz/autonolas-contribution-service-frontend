import { Typography } from 'antd/lib';
import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph, Text } = Typography;

const Actions = () => (
  <div id={DOCS_SECTIONS.actions}>
    <Title level={2}>Actions</Title>
    <Paragraph>
      Actions are tasks that are designed by the DAO to maximize impact for
      Autonolas’ success. When community members complete actions, they
      contribute to the DAO’s progress.
    </Paragraph>

    <Paragraph>
      Each action has a name, instructions and points. Take a simple example:
    </Paragraph>

    <Paragraph>
      <ul>
        <li>
          <Text strong>Name</Text>
          &nbsp;– Complete an Academy Task
        </li>
        <li>
          <Text strong>Instructions</Text>
          &nbsp;– Finish one of the tasks between modules and send a screenshot
          using the&nbsp;
          <a
            href="https://forms.gle/vuVNa5823CUMr4Ho6"
            target="_blank"
            rel="noreferrer"
          >
            claim form
          </a>
          .
        </li>
        <li>
          <Text strong>Points</Text>
          &nbsp;– 4500
        </li>
      </ul>
    </Paragraph>

    <Paragraph>
      In the action in this example will earn a community member 4500 points.
    </Paragraph>

    <Paragraph>
      Actions change regularly – new ones are added, some are removed, points
      and instructions change etc. See the current set of actions&nbsp;
      <a
        href="https://discord.com/channels/899649805582737479/1030087446882418688/1034340826718937159"
        target="_blank"
        rel="noreferrer"
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

export default Actions;
