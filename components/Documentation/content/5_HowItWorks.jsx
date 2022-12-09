import { Typography } from 'antd/lib';
import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph } = Typography;

const HowItWorks = () => (
  <div id={DOCS_SECTIONS['how-it-works']}>
    <Title level={2}>How It Works</Title>
    <Paragraph>Coming soon</Paragraph>

    <br />
    <br />
    <br />
  </div>
);

export default HowItWorks;
