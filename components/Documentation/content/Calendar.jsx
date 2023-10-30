import { Typography } from 'antd/lib';
import { DOCS_SECTIONS } from '../helpers';

const { Title, Paragraph } = Typography;

const Calendar = () => (
  <div id={DOCS_SECTIONS.calendar}>
    <Title level={2}>Calendar</Title>

    <Paragraph>
      Calendar is a community-created resource to show past and prior events in the Olas ecosytem.
    </Paragraph>
    <Paragraph>
      To propose an event, add it to events.json in the
      {' '}
      <a
        href="https://github.com/valory-xyz/autonolas-contribution-service-frontend"
        target="_blank"
        rel="noreferrer noopener"
      >
        Contribute frontend repo&nbsp;↗
      </a>
      {' '}
      and submit a PR.
    </Paragraph>

  </div>
);

export default Calendar;
