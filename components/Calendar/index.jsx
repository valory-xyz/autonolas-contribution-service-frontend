import React, { Fragment, useState } from 'react';
import moment from 'moment';
import Link from 'next/link';
import {
  Switch,
  Calendar,
  Typography,
  Row,
  Col,
  Timeline,
  Card,
  Grid,
} from 'antd/lib';

import { EducationTitle } from 'common-util/Education/EducationTitle';
import events from './events.json';
import { Cell } from './styles';

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const CalendarPage = () => {
  const [hidePastEvents, setHidePastEvents] = useState(true);

  const screens = useBreakpoint();

  const processedEvents = events
    .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
    .map((event) => {
      // Convert the timestamp to a date in the format "YYYY-MM-DD"
      const date = moment.unix(event.timestamp).format('YYYY-MM-DD');
      // Add the date to the event item
      return { ...event, date };
    });

  const eventsList = processedEvents.filter((event) => {
    if (hidePastEvents) {
      return Number(event.timestamp) >= moment().unix();
    }
    return true;
  });

  const dateCellRender = (value) => {
    // Generate a date from the timestamp and format it in the Chinese format
    const listData = processedEvents.filter(
      (event) => value.format('YYYY-MM-DD') === event.date,
    );

    return (
      <>
        {listData.map((item) => (
          <Cell key={item.id}>
            <Link href={`/calendar/events/${item.id}`}>
              <Text className="cell-text">{item.title}</Text>
            </Link>
          </Cell>
        ))}
      </>
    );
  };

  const monthCellRender = (value) => {
    // Filter events for the month
    const monthData = processedEvents.filter(
      (event) => value.format('YYYY-MM')
        === moment.unix(event.timestamp).format('YYYY-MM'),
    );

    return (
      <>
        {monthData.map((item) => (
          <Cell key={item.id} className="mb-4">
            <Link href={`/calendar/events/${item.id}`}>
              <Text className="cell-text">{item.title}</Text>
            </Link>
          </Cell>
        ))}
      </>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <EducationTitle title="Calendar" educationItem="calendar" />
      </div>
      <Row gutter={16}>
        {screens.lg && (
          <Col span={16}>
            <Calendar
              dateCellRender={dateCellRender}
              monthCellRender={monthCellRender}
            />
          </Col>
        )}
        <Col span={screens.lg ? 8 : 24}>
          <Card>
            <Title level={5} className="mb-8">
              Events
            </Title>
            <div className="mb-24">
              <Switch
                checked={hidePastEvents}
                onChange={(checked) => setHidePastEvents(checked)}
              />
              <Text type="secondary">Hide past events</Text>
            </div>

            {eventsList.length === 0 ? (
              <Text type="secondary">No future events</Text>
            ) : (
              <Timeline
                mode="left"
                items={eventsList.map((event) => ({
                  children: (
                    <Fragment key={event.id}>
                      <Link
                        className="cell-text"
                        href={`/calendar/events/${event.id}`}
                      >
                        {event.title}
                      </Link>
                      <br />
                      <Text type="secondary">
                        {moment.unix(event.timestamp).format('DD MMM YYYY')}
                      </Text>
                    </Fragment>
                  ),
                }))}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default CalendarPage;
