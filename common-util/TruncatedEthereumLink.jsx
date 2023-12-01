import React from 'react';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { truncateAddress } from './functions';

function TruncatedEthereumLink({ text, isTransaction, className }) {
  const truncatedText = truncateAddress(text);

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
