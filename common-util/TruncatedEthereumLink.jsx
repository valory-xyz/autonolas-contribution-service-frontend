import React from 'react';
import { Tooltip } from 'antd/lib';
import PropTypes from 'prop-types';

function TruncatedEthereumLink({ text, isTransaction, className }) {
  const truncatedText = `${text?.slice(0, 6)}...${text?.slice(-4)}`;

  const etherscanLink = `https://etherscan.io/${
    isTransaction ? 'tx' : 'address'
  }/${text}`;

  return (
    <Tooltip title={text}>
      <a href={etherscanLink} target="_blank" rel="noopener noreferrer" className={className}>
        {truncatedText}
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
