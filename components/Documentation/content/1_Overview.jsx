import { Typography } from 'antd/lib';

const { Title, Paragraph, Text } = Typography;

const Overview = () => (
  <>
    <div id="section-overview">
      <Title level={2}>Overview</Title>
      <Paragraph>
        Autonolas Contribute is a system for coordinating work in the Autonolas
        DAO. It is made up of 3 main components:
      </Paragraph>

      <Paragraph>
        <ul>
          <li>
            <Text strong>Idle</Text>
            &nbsp;– tasks defined by the DAO. When community members complete
            tasks they earn points.
          </li>
          <li>
            <Text strong>Badge</Text>
            &nbsp;– everybody in the community has a profile. Profiles include a
            badge which dynamically updates when community members complete
            actions and earn points.
          </li>
          <li>
            <Text strong>Leaderboard</Text>
            &nbsp;– community members are ranked based on the points they’ve
            earned by completing actions.
          </li>
        </ul>
      </Paragraph>

      <Paragraph>
        Autonolas Contribute is powered by an autonomous service. This means it
        is able to automate complex operations in a fully decentralized way, for
        example:
        <ul>
          <li>processing actions</li>
          <li>aggregating points</li>
          <li>updating NFT metadata</li>
        </ul>
      </Paragraph>

      <br />
      <br />
      <br />
    </div>
  </>
);

export default Overview;
