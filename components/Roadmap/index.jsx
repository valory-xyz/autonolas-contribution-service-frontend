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
      return {color: "blue", text: "AIP that has been accepted for implementation by the Autonolas community"};
    case "Proposed":
      return {color: "blue", text: "AIP that is ready to be proposed on-chain"};
    case "Implemented":
      return {color: "green", text: "AIP that has been released to mainnet"};
    case "Rejected":
      return {color: "red", text: "AIP that has been rejected"};
    default:
      return {color: "", text: "AIP that is still being developed"};
  }
};

const RoadmapTag = styled(Tag)`
  font-weight: 500;
  font-size: 14px;
  font-family: Inter;
  line-height: 20px;
  padding: 2px 8px 2px 8px;
  margin-bottom: 12px;
`; 

const RoadmapLink = ({ text, link }) => {
  return (
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Link style={{ textDecoration: 'none' }}>
        {text} ↗
      </Link>
    </a>
  );
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
                {getTagItems(item.tag).text}
                  <br />
                  <RoadmapLink 
                    text="More about AIP statuses" 
                    link="https://github.com/valory-xyz/autonolas-aip/tree/aip-2?tab=readme-ov-file#aip-statuses" 
                  />
              </>} 
              trigger="hover"
              overlayStyle={{ maxWidth: "400px" }}
            >
              <RoadmapTag bordered={true} color={getTagItems(item.tag).color}>{item.tag}</RoadmapTag>
            </Popover>
            
              <Title level={4}>{item.title}</Title>
              <p>{item.description}</p>
              <Text strong>Initial Proposal</Text>
              <br />
                <RoadmapLink 
                  text="Read" 
                  link={item.link} 
                />
                <Text type="secondary">{' · '}</Text>
                <RoadmapLink 
                  text="Discuss" 
                  link="https://discord.com/channels/899649805582737479/1121019872839729152" 
                />
                <Text type="secondary">
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
