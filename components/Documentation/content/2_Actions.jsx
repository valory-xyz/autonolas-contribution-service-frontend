import { Typography } from 'antd/lib';
import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph } = Typography;

const ActionsDocs = () => (
  <div id={DOCS_SECTIONS.actions}>
    <Title level={2}>Actions</Title>
    <Paragraph>
      Actions are tasks that are designed by the DAO to maximize impact for
      Autonolas’ success. When community members complete actions, they
      contribute to the DAO’s progress.
    </Paragraph>

    <Paragraph>
      Each action has a name, instructions and points. When you complete an
      action, it is automatically tracked and the corresponding points are added
      to your profile.
    </Paragraph>
    <br />
    <br />
    <br />
  </div>
);

export default ActionsDocs;
