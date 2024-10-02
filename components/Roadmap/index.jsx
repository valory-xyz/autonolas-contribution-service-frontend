import {
  Card, Typography, Row, Col, Tag, Popover
} from 'antd';
import Image from 'next/image';
import dayjs from 'dayjs';
import { useScreen } from '@autonolas/frontend-library';
import { EducationTitle } from 'common-util/Education/EducationTitle';
import { useMemo } from 'react';
import styled from 'styled-components';
import roadmapItems from './roadmapItems.json';

const { Text, Title, Link } = Typography;

const ResponsiveImage = styled(Image)`
  max-width: 100%;
  object-fit: contain;
`;

const getTagItems = (tag) => {
  switch (tag) {
    case "Approved":
      return ["blue", "AIP that has been accepted for implementation by the Autonolas community"];
    case "Proposed":
      return ["blue", "AIP that is ready to be proposed on-chain"];
    case "Implemented":
      return ["green", "AIP that has been released to mainnet"];
    case "Rejected":
      return ["red", "AIP that has been rejected"];
    default:
      return ["", "AIP that is still being developed"];
  }
};

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
            <Col xs={24} md={24} lg={10} align="middle">
              <ResponsiveImage
                src={item.imageUrl}
                alt={item.title}
                width={imageWidth}
                height={imageHeight}
              />
            </Col>
            <Col xs={24} md={24} lg={14}>
            <Popover 
              content={<>
                {getTagItems(item.tag)[1]}
                  <>
                    <br />
                    <Link href={"https://github.com/valory-xyz/autonolas-aip/tree/aip-2?tab=readme-ov-file#aip-statuses"}>More about AIP statuses ↗</Link>
                  </>
              </>} 
              trigger="hover"
              overlayStyle={{width: "400px"}}
            >
              <Tag className="mb-12" bordered={true} color={getTagItems(item.tag)[0]} style={{
                fontWeight: '500', 
                fontSize: '14px',
                fontFamily: 'Inter',
                padding: '4px'
              }}>{item.tag}</Tag>
            </Popover>
            
              <Title level={4}>{item.title}</Title>
              <p>{item.description}</p>
              <Text strong>Initial Proposal</Text>
              <br />
              <Text type="secondary">
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read ↗
                </Link>
                {' · '}
                <Link
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
