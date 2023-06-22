import React from 'react';
import PropTypes from 'prop-types';
import {
  Col, Popover, Row, Typography,
} from 'antd/lib';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getEducationItemByComponent } from 'common-util/functions';
import Link from 'next/link';

const { Title, Text } = Typography;

const PopoverContent = ({ educationItem }) => (
  <>
    <Text>{educationItem?.text || '--'}</Text>
    {educationItem?.docsLink && (
      <>
        <br />
        <Link href={`/docs/${educationItem.docsLink}`}>Learn more</Link>
      </>
    )}
  </>
);

PopoverContent.propTypes = {
  educationItem: PropTypes.shape({
    text: PropTypes.string.isRequired,
    docsLink: PropTypes.string,
  }).isRequired,
};

export const EducationTitle = ({ title, level, educationItemSlug }) => {
  const educationItem = getEducationItemByComponent(educationItemSlug);

  return (
    <>
      <Row gutter={8} align="middle" className="mb-12">
        <Col>
          <Title level={level} className="mb-0">
            {title}
          </Title>
        </Col>
        <Col>
          <Popover
            content={<PopoverContent educationItem={educationItem} />}
            placement="topLeft"
            overlayInnerStyle={{ maxWidth: 300 }}
          >
            <InfoCircleOutlined className="mb-0" />
          </Popover>
        </Col>
      </Row>
    </>
  );
};

EducationTitle.propTypes = {
  title: PropTypes.string.isRequired,
  educationItemSlug: PropTypes.string.isRequired,
  level: PropTypes.number,
};

EducationTitle.defaultProps = {
  level: 4,
};
