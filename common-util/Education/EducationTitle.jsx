import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Popover, Row, Typography } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { getEducationItemByComponent } from 'util/education';

const { Title } = Typography;

const PopoverContent = ({ text, docsLink }) => (
  <>
    {text}
    {docsLink && (
      <>
        <br />
        <Link href={`/docs${docsLink}`}>Learn more</Link>
      </>
    )}
  </>
);

PopoverContent.propTypes = {
  text: PropTypes.string.isRequired,
  docsLink: PropTypes.string,
};

PopoverContent.defaultProps = {
  docsLink: '',
};

/**
 * Education title component
 */
export const EducationTitle = ({ title, level, educationItem }) => {
  const [fullEducationItem, setFullEducationItem] = useState({});
  const { text, docsLink } = fullEducationItem;

  useEffect(() => {
    const intFullEducationItem = getEducationItemByComponent(educationItem);
    setFullEducationItem(intFullEducationItem);
  }, [educationItem]);

  return (
    <Row gutter={8} align="middle">
      <Col>
        <Title level={level} className="mb-0">
          {title}
        </Title>
      </Col>
      <Col>
        <Popover
          content={<PopoverContent text={text || ''} docsLink={docsLink} />}
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
  title: PropTypes.string,
  educationItem: PropTypes.string.isRequired,
  level: PropTypes.number,
};

EducationTitle.defaultProps = {
  level: 4,
  title: '',
};
