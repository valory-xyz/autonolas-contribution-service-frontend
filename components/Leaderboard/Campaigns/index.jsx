import { ReadOutlined } from '@ant-design/icons';
import { Card, Table, Typography } from 'antd';
import { get } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

// import { getTimeAgo } from 'common-util/functions/time';
import { DEFAULT_COORDINATE_ID } from 'util/constants';

const { Title, Paragraph } = Typography;
export const Description = styled.div`
  color: #4d596a;
  a {
    color: #4d596a;
    text-decoration: underline;
  }
`;

const DESCRIPTION_BY_IDS = {
  OlasAgents: (
    <Description>
      Spread the word about Olas’ dominance in enabling{' '}
      <a
        href="https://x.com/autonolas/status/1864671146702155938"
        target="_blank"
        rel="noopener noreferrer"
      >
        Agent-to-Agent transactions ↗
      </a>
      , the different operational{' '}
      <a
        href="https://x.com/autonolas/status/1867147410583253006"
        target="_blank"
        rel="noopener noreferrer"
      >
        Olas Agents ↗
      </a>
      , and more. Share the link to running agents via Pearl.
    </Description>
  ),
  OlasNetwork: (
    <Description>
      Educate others about{' '}
      <a href="https://olas.network/" target="_blank" rel="noopener noreferrer">
        Olas
      </a>
      , its leadership in the{' '}
      <a
        href="https://x.com/autonolas/status/1864671146702155938"
        target="_blank"
        rel="noopener noreferrer"
      >
        Agent ↗
      </a>{' '}
      space, and the many ways to{' '}
      <a href="https://olas.network#get-involved" target="_blank" rel="noopener noreferrer">
        co-own AI
      </a>{' '}
      & contribute to Olas with one of the six roles:{' '}
      <a href="https://olas.network/contribute" target="_blank" rel="noopener noreferrer">
        Contributor
      </a>
      ,{' '}
      <a href="https://olas.network/operate" target="_blank" rel="noopener noreferrer">
        Operator
      </a>
      ,{' '}
      <a href="https://olas.network/launch" target="_blank" rel="noopener noreferrer">
        Launcher
      </a>
      ,{' '}
      <a href="https://olas.network/build" target="_blank" rel="noopener noreferrer">
        Builder
      </a>
      ,{' '}
      <a href="https://olas.network/govern" target="_blank" rel="noopener noreferrer">
        Governor
      </a>
      ,{' '}
      <a href="https://olas.network/bond" target="_blank" rel="noopener noreferrer">
        Bonder
      </a>
      .
    </Description>
  ),
  StakeWithPearl: (
    <Description>
      Talk about{' '}
      <a href="https://olas.network/operate" target="_blank" rel="noopener noreferrer">
        Pearl
      </a>{' '}
      — easily running agents,{' '}
      <a href="https://operate.olas.network/contracts" target="_blank" rel="noopener noreferrer">
        staking
      </a>{' '}
      OLAS, earning potential rewards, and product updates. Share your journey or even{' '}
      <a
        href="https://olas.network/blog/the-3-step-guide-to-start-running-agents-with-pearl"
        target="_blank"
        rel="noopener noreferrer"
      >
        tips to get started
      </a>{' '}
      with the link to{' '}
      <a href="https://olas.network/operate" target="_blank" rel="noopener noreferrer">
        Pearl
      </a>
      .
    </Description>
  ),
  AgentsUnleashed: (
    <Description>
      Fuel the hype for the global{' '}
      <a
        href="https://lu.ma/calendar/cal-jzVaHMZnzkjYEyd"
        target="_blank"
        rel="noopener noreferrer"
      >
        Agents Unleashed ↗
      </a>{' '}
      events! Share your favorite moments, photos, or{' '}
      <a
        href="https://www.youtube.com/@autonolas/playlists"
        target="_blank"
        rel="noopener noreferrer"
      >
        YouTube ↗
      </a>{' '}
      videos. Share the link to register for the next event or the official event{' '}
      <a
        href="https://lu.ma/calendar/cal-jzVaHMZnzkjYEyd"
        target="_blank"
        rel="noopener noreferrer"
      >
        calendar ↗
      </a>
      .
    </Description>
  ),
};

const columns = [
  {
    title: 'Hashtag',
    dataIndex: 'hashtag',
    render: (hashtag) => `#${hashtag}`,
    width: 120,
  },
  Table.EXPAND_COLUMN,
  // {
  //   title: 'Start Date',
  //   dataIndex: 'start_ts',
  //   render: (start_ts) => (start_ts ? getTimeAgo(start_ts * 1000) : '-'),
  //   width: 140,
  // },
];

export const Campaigns = () => {
  const isLoading = useSelector((state) => state?.setup?.isMemoryDetailsLoading);
  const memoryDetailsList = useSelector((state) => state?.setup?.memoryDetails || []);
  const currentMemoryDetails = memoryDetailsList.find((c) => c.id === DEFAULT_COORDINATE_ID) || {};
  const twitterCampaigns = get(currentMemoryDetails, 'plugins_data.twitter_campaigns.campaigns');

  return (
    <Card>
      <Title level={3} className="mt-0 mb-8">
        Campaigns
      </Title>
      <Paragraph>
        Mention{' '}
        <a href="https://twitter.com/autonolas" target="_blank" rel="noopener noreferrer">
          @autonolas
        </a>{' '}
        or use at least one of the following tags in your tweet to earn leaderboard points and be
        eligible for staking rewards.
      </Paragraph>
      <Paragraph>
        The leaderboard points you can earn by tweeting vary according to the AI&apos;s evaluation.
      </Paragraph>
      <Table
        columns={columns}
        dataSource={twitterCampaigns}
        expandable={{
          expandIcon: ({ onExpand, record }) => {
            const Icon = ReadOutlined;
            return (
              <div
                style={{ fontSize: '14px', color: '#7E22CE', cursor: 'pointer' }}
                onClick={(e) => onExpand(record, e)}
              >
                <Icon /> Guide
              </div>
            );
          },
          expandedRowRender: (record) => {
            const desc = DESCRIPTION_BY_IDS[record.id];
            return desc;
          },
        }}
        loading={isLoading}
        rowKey={'id'}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
};
