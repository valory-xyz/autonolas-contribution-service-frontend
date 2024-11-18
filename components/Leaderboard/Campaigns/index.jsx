import { Card, Table, Typography } from 'antd';
import { get } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';

// import { getTimeAgo } from 'common-util/functions/time';
import { DEFAULT_COORDINATE_ID } from 'util/constants';

const { Title, Paragraph } = Typography;

const columns = [
  {
    title: 'Hashtag',
    dataIndex: 'hashtag',
    render: (hashtag) => `#${hashtag}`,
    width: 120,
  },
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
        and include at least one of the following tags to earn leaderboard points and be eligible
        for staking rewards.
      </Paragraph>
      <Paragraph>
        The leaderboard points you can earn by tweeting vary according to the AI&apos;s evaluation.
      </Paragraph>
      <Table
        columns={columns}
        dataSource={twitterCampaigns}
        loading={isLoading}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
};
