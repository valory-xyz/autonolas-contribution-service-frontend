import { Card, Typography } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { NA } from '@autonolas/frontend-library';

import events from './events.json';

const { Text, Title } = Typography;

const EventPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState({});

  useEffect(() => {
    const matchedEvent = events.find((e) => e.id === id);
    setEvent(matchedEvent);
  }, [id]);

  return (
    <>
      <div className="mb-8">
        <Link href="/calendar">← Back to calendar</Link>
      </div>
      <Card>
        <Title level={2}>{event.title || NA}</Title>
        <Text strong>Time</Text>
        <p>{moment.unix(event.timestamp).format('h:mm a MMMM D YYYY') || NA}</p>
        <Text strong>Location</Text>
        <p>
          {event.location &&
            // Check if event location is a URL
            (/^http(s)?:\/\//.test(event.location) ? (
              <a href={event.location} target="_blank" rel="noopener noreferrer">
                {event.location} ↗
              </a>
            ) : (
              // If event location is not a URL, display it as is
              event.location
            ))}
          {!event.location && NA}
        </p>
        <Text strong>Description</Text>
        <p>{event.description || NA}</p>
      </Card>
    </>
  );
};

export default EventPage;
