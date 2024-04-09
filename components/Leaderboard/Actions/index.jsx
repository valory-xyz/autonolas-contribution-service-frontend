import React from 'react';
import { Card, List, Typography } from 'antd';
import { EducationTitle } from '../MintNft/Education';
import data from './data.json';

const { Text, Paragraph } = Typography;

const Actions = () => (
  <>
    <EducationTitle title="Actions" level={3} educationItemSlug="actions" marginBottom="mb-4" />
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
                    {`Points: ${item.points}`}
                  </Text>
                </>
              )}
              className="mr-48"
            />
          </List.Item>
        )}
      />
    </Card>
  </>
);

export default Actions;
