import { Typography } from 'antd/lib';
import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph } = Typography;

const Roadmap = () => (
  <div id={DOCS_SECTIONS.roadmap}>
    <Title level={2}>Roadmap</Title>

    <Paragraph>
      {'Roadmap is a community-created resource to show what projects members of the ecosystem are working towards, '
        + "and what's coming further down the line."}
    </Paragraph>
    <Paragraph>
      To propose a new roadmap item, follow the instructions in the
      {' '}
      <a
        href="https://github.com/valory-xyz/autonolas-contribution-service-frontend#contribution-service-frontend"
        target="_blank"
        rel="noreferrer noopener"
      >
        README&nbsp;↗
      </a>
      .
    </Paragraph>
    <br />
    <br />
    <br />
  </div>
);

export default Roadmap;
