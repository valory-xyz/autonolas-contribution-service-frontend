import React from 'react';
import PropTypes from 'prop-types';
import {
  Col, Popover, Row, Typography,
} from 'antd/lib';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getEducationItemByComponent } from 'util/education';

const { Title } = Typography;

export const EducationTitle = ({ title, level, educationItem }) => (
  <Row gutter={8} align="middle">
    <Col>
      <Title level={level} className="mb-0">
        {title}
      </Title>
    </Col>
    <Col>
      <Popover
        content={getEducationItemByComponent(educationItem).text}
        placement="topLeft"
        overlayInnerStyle={{ maxWidth: 300 }}
      >
        <InfoCircleOutlined className="mb-0" />
      </Popover>
    </Col>
  </Row>
);

EducationTitle.propTypes = {
  title: PropTypes.string.isRequired,
  educationItem: PropTypes.string.isRequired,
  level: PropTypes.number,
};

EducationTitle.defaultProps = {
  level: 4,
};
