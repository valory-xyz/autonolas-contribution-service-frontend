import {
  Card, Typography, Row, Col,
} from 'antd';
import Image from 'next/image';
import dayjs from 'dayjs';
import { useScreen } from '@autonolas/frontend-library';
import { EducationTitle } from 'common-util/Education/EducationTitle';
import { useMemo } from 'react';
import roadmapItems from './roadmapItems.json';

const { Text, Title, Link } = Typography;

const RoadmapPage = () => {
  const sortedRoadmapItems = roadmapItems.sort(
    (a, b) => dayjs(b.date).unix() - dayjs(a.date).unix(),
  );

  const { isMobile, isTablet } = useScreen();

  const imageWidth = useMemo(() => {
    if (isMobile) return 320;
    if (isTablet) return 400;
    return 500;
  }, [isMobile, isTablet]);

  const imageHeight = useMemo(() => {
    if (isMobile) return 240;
    if (isTablet) return 300;
    return 390;
  }, [isMobile, isTablet]);

  return (
    <div>
      <div className="mb-8">
        <EducationTitle title="Roadmap" level={3} educationItem="roadmap" />
      </div>
      {sortedRoadmapItems.map((item, index) => (
        <Card className="mb-12" bordered={false} key={`roadmap-${index}`}>
          <Row gutter={16} align="middle">
            <Col xs={24} md={24} lg={10}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={imageWidth}
                height={imageHeight}
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
                {' · '}
                <Link
                  type="secondary"
                  href="https://discord.com/channels/899649805582737479/1121019872839729152"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discuss ↗
                </Link>
                {` · Proposed: ${dayjs(item.date).format('MMMM D YYYY')}`}
              </Text>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default RoadmapPage;
