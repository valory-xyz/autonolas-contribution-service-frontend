import React from 'react';
import { List, Typography } from 'antd/lib';
import { EducationTitle } from 'components/Education';
import data from './data.json';

const { Text, Paragraph } = Typography;

const Actions = () => (
  <>
    <EducationTitle title="Actions" level={3} educationItemSlug="actions" marginBottom="mb-4" />
    <div className="mb-8">
      <Text type="secondary">
        Need inspiration for content? Check out
        {' '}
        <a href="https://olas-ripples.oaksprout.repl.co" rel="noopener noreferrer" target="_blank">Olas Ripples</a>
        {' '}
        for ideas
      </Text>
    </div>
    <List
      bordered
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={item.name}
            description={(
              <Paragraph type="secondary" ellipsis={{ rows: 1, expandable: true, symbol: 'more' }} className="mb-0">
                {item.description}
              </Paragraph>
              )}
            className="mr-48"
          />
          <div>
            {`Points: ${item.points}`}
          </div>
        </List.Item>
      )}
    />
  </>
);

export default Actions;
