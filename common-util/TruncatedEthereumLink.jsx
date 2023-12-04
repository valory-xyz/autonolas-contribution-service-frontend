import React from 'react';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { EllipsisMiddle } from '@autonolas/frontend-library';

function TruncatedEthereumLink({ text, isTransaction, className }) {
  const etherscanLink = `https://etherscan.io/${
    isTransaction ? 'tx' : 'address'
  }/${text}`;

  return (
    <Tooltip title={text}>
      <a href={etherscanLink} target="_blank" rel="noopener noreferrer" className={className}>
        <EllipsisMiddle>{text}</EllipsisMiddle>
      </a>
    </Tooltip>
  );
}

TruncatedEthereumLink.propTypes = {
  text: PropTypes.string.isRequired,
  isTransaction: PropTypes.bool,
  className: PropTypes.string,
};

TruncatedEthereumLink.defaultProps = {
  isTransaction: false,
  className: '',
};

export default TruncatedEthereumLink;
