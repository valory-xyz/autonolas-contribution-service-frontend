import React from 'react';
import { Card, List, Typography } from 'antd/lib';
import { EducationTitle } from '../MintNft/Education';
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
    <Card bodyStyle={{ padding: 0 }}>
      <List
        itemLayout="horizontal"
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.name}
              description={(
                <>
                  <Paragraph type="secondary">
                    {item.description}
                  </Paragraph>
                  <Text>
                    Points:
                    {' '}
                    {item.points}
                  </Text>
                </>
              )}
              className="mr-48"
            />
            <div />
          </List.Item>
        )}
      />
    </Card>
  </>
);

export default Actions;
