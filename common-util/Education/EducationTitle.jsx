import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Col, Popover, Row, Typography,
} from 'antd/lib';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getEducationItemByComponent } from 'util/education';
import Link from 'next/link';

const { Title } = Typography;

const PopoverContent = ({ text, docsLink }) => (
  <>
    {text}
    {docsLink && (
      <>
        <br />
        <Link href={`/docs${docsLink}`}>
          <a className="ml-8">Learn more</a>
        </Link>
      </>
    )}
  </>
);

export const EducationTitle = ({ title, level, educationItem }) => {
  const [fullEducationItem, setFullEducationItem] = useState({});
  const { text, docsLink } = fullEducationItem;

  useEffect(() => {
    const intFullEducationItem = getEducationItemByComponent(educationItem);
    setFullEducationItem(intFullEducationItem);
  }, []);

  return (
    <Row gutter={8} align="middle">
      <Col>
        <Title level={level} className="mb-0">
          {title}
        </Title>
      </Col>
      <Col>
        <Popover
          content={<PopoverContent text={text} docsLink={docsLink} />}
          placement="topLeft"
          overlayInnerStyle={{ maxWidth: 300 }}
        >
          <InfoCircleOutlined className="mb-0" />
        </Popover>
      </Col>
    </Row>
  );
};

EducationTitle.propTypes = {
  title: PropTypes.string.isRequired,
  educationItem: PropTypes.string.isRequired,
  level: PropTypes.number,
};

EducationTitle.defaultProps = {
  level: 4,
};
