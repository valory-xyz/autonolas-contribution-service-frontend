/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { Alert } from 'antd/lib';
import Image from 'next/image';
import { Ellipsis } from 'components/GlobalStyles';
import { TRANSACTION_STATE } from 'util/constants';

export const TransactionSuccessMessage = styled.div`
  .t-id {
    display: flex;
    line-height: normal;
    margin-top: 0.35rem;
  }
`;

export const getUrl = (chainId, transactionId) => {
  if (chainId === 5) {
    return `https://goerli.etherscan.io/tx/${transactionId}`;
  }
  return `https://etherscan.io/tx/${transactionId}`;
};

const AlertInfo = ({ transactionState, chainId, transactionId }) => (
  <>
    {transactionState === TRANSACTION_STATE.success && (
      <Alert
        type="info"
        message={(
          <TransactionSuccessMessage>
            <div>Transaction Submitted</div>
            <div className="t-id">
              Track on Etherscan:&nbsp;
              <a
                href={getUrl(chainId, transactionId)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ropsten-transaction"
              >
                <Ellipsis>{transactionId}</Ellipsis>
                <span className="external-link">
                  <Image
                    src="/images/external-link.svg"
                    alt="Transaction link"
                    width={18}
                    height={16}
                  />
                </span>
              </a>
            </div>
          </TransactionSuccessMessage>
        )}
      />
    )}

    {transactionState === TRANSACTION_STATE.failure && (
      <Alert
        message="Claim transaction failed – try again"
        type="error"
        showIcon
      />
    )}
  </>
);

export default AlertInfo;
