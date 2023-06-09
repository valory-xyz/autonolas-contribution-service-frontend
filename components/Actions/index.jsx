import React from 'react';
import { List, Typography } from 'antd/lib';
import { EducationTitle } from 'components/Education';
import data from './data.json';

const { Paragraph } = Typography;

const Actions = () => (
  <>
    <EducationTitle title="Actions" level={3} educationItemSlug="actions" />
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
