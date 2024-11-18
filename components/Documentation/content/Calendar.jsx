import { Typography } from 'antd';

import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph } = Typography;

export const Calendar = () => (
  <div id={DOCS_SECTIONS.calendar}>
    <Title level={2}>Calendar</Title>

    <Paragraph>
      Calendar is a community-created resource to show past and prior events in the Olas ecosytem.
    </Paragraph>
    <Paragraph>
      To propose an event, follow the instructions in the{' '}
      <a
        href="https://github.com/valory-xyz/autonolas-contribution-service-frontend#contribution-service-frontend"
        target="_blank"
        rel="noreferrer noopener"
      >
        README&nbsp;↗
      </a>
      .
    </Paragraph>
  </div>
);
