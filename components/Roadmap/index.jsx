import {
  Card, Typography, Row, Col,
} from 'antd/lib';
import Image from 'next/image';
import dayjs from 'dayjs';

const { Text, Title, Link } = Typography;

const roadmapItems = [
  {
    title: 'Triple Lock',
    description: 'This workstream implements Triple Lock, an upgrade to the protocol that improves bonding, dev rewards, and staking.',
    imageUrl: 'https://github.com/valory-xyz/autonolas-aip/raw/aip-1/content/imgs/triple_lock.png?raw=true',
    link: 'https://github.com/valory-xyz/autonolas-aip/blob/aip-1/content/aips/core-aip-triple-lock.md',
    date: '2023-08-15',
  },
  {
    title: 'Build-A-PoSe',
    description: 'This workstream implements Build-A-PoSe, a structured programme operated by the DAO to consistently deliver new Olas-owned services.',
    imageUrl: 'https://github.com/valory-xyz/autonolas-aip/blob/aip-2/content/imgs/Build-A-PoSe.png?raw=true',
    link: 'https://github.com/valory-xyz/autonolas-aip/blob/aip-2/content/aips/core-build-a-pose.md',
    date: '2023-10-13',
  },
];

const RoadmapPage = () => {
  roadmapItems.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());

  return (
    <div>
      <Title level={3}>Roadmap</Title>
      {roadmapItems.map((item) => (
        <Card className="mb-12" bordered={false}>
          <Row gutter={16} align="middle">
            <Col xs={24} md={24} lg={10}>
              <Image src={item.imageUrl} alt={item.title} width={640} height={495} />
            </Col>
            <Col xs={24} md={24} lg={14}>
              <Title level={4}>{item.title}</Title>
              <p>{item.description}</p>
              <Text strong>Initial Proposal</Text>
              <br />
              <Text type="secondary">
                <Link type="secondary" href={item.link} target="_blank" rel="noopener noreferrer">Read proposal ↗</Link>
                {' '}
                ·
                {' '}
                <Link type="secondary" href="https://discord.com/channels/899649805582737479/1121019872839729152" target="_blank" rel="noopener noreferrer">
                  Join discussion ↗
                </Link>
                {' '}
                ·
                Proposed:
                {' '}
                {dayjs(item.date).format('MMMM D, YYYY')}
              </Text>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default RoadmapPage;
