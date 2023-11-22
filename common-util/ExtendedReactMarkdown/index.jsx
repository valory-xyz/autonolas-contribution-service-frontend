import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { Typography } from 'antd';

const { Text } = Typography;

function ExtendedReactMarkdown({ content, rows }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(true);
  };

  const visibleContent = expanded
    ? content
    : content.split('\n').slice(0, rows).join('\n');
  const showExpansionLink = !expanded && content.split('\n').length > rows;

  return (
    <div>
      <Text type="primary">
        <ReactMarkdown>{visibleContent}</ReactMarkdown>
      </Text>
      {showExpansionLink && (
        <Text
          type="secondary"
          underline
          onClick={handleExpand}
          style={{ cursor: 'pointer' }}
        >
          Show more
        </Text>
      )}
    </div>
  );
}

ExtendedReactMarkdown.propTypes = {
  content: PropTypes.string.isRequired,
  rows: PropTypes.number.isRequired,
};

export default ExtendedReactMarkdown;
