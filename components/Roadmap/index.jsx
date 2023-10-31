import {
  Card, Typography, Row, Col,
} from 'antd/lib';
import Image from 'next/image';
import dayjs from 'dayjs';
import roadmapItems from 'components/Roadmap/roadmapItems.json';
import { EducationTitle } from 'common-util/Education/EducationTitle';

const { Text, Title, Link } = Typography;

const RoadmapPage = () => {
  const sortedRoadmapItems = roadmapItems.sort(
    (a, b) => dayjs(b.date).unix() - dayjs(a.date).unix(),
  );

  return (
    <div>
      <div className="mb-8">
        <EducationTitle title="Roadmap" level={3} educationItem="roadmap" />
      </div>
      {sortedRoadmapItems.map((item) => (
        <Card className="mb-12" bordered={false}>
          <Row gutter={16} align="middle">
            <Col xs={24} md={24} lg={10}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={640}
                height={495}
              />
            </Col>
            <Col xs={24} md={24} lg={14}>
              <Title level={4}>{item.title}</Title>
              <p>{item.description}</p>
              <Text strong>Initial Proposal</Text>
              <br />
              <Text type="secondary">
                <Link
                  type="secondary"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read ↗
                </Link>
                {' '}
                ·
                {' '}
                <Link
                  type="secondary"
                  href="https://discord.com/channels/899649805582737479/1121019872839729152"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discuss ↗
                </Link>
                {' '}
                · Proposed:
                {' '}
                {dayjs(item.date).format('MMMM D YYYY')}
              </Text>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default RoadmapPage;
