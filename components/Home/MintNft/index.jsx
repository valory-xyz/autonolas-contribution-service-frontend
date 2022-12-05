import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd/lib';
import PropTypes from 'prop-types';
// import get from 'lodash/get';
import { getToken } from '../common';
import {
  fetchMapLockedBalances,
  fetchReleasableAmount,
  withdraw,
} from './utils';
import { MiddleContent, SectionHeader, Sections } from '../styles';
import { BuOlasContainer, WriteFunctionalityContainer } from './styles';

const BuOlas = ({ account, chainId }) => {
  // balances
  const [isLoading, setIsLoading] = useState(true);
  const [mappedBalances, setMappedBalances] = useState(null);
  const [releasableAmount, setReleasableAmount] = useState(null);

  // withdraw
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);

  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        setIsLoading(true);
        try {
          const values = await fetchMapLockedBalances({
            account,
            chainId,
          });
          setMappedBalances(values);

          const rAmount = await fetchReleasableAmount({
            account,
            chainId,
          });
          setReleasableAmount(rAmount);
        } catch (error) {
          window.console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fn();
  }, [account, chainId]);

  const onWithdraw = async () => {
    if (account && chainId) {
      setIsWithdrawLoading(true);
      try {
        await withdraw({ account, chainId });
      } catch (error) {
        window.console.error(error);
      } finally {
        setIsWithdrawLoading(false);
      }
    }
  };

  const {
    amount, startTime, endTime, transferredAmount,
  } = mappedBalances || {};

  return (
    <BuOlasContainer>
      <div className="left-content">
        <MiddleContent className="balance-container">
          <SectionHeader>Locked Balances</SectionHeader>
          <Sections>
            {getToken({
              tokenName: 'Amount',
              token: amount || '--',
              isLoading,
            })}
            {getToken({
              tokenName: 'Transferred Amount',
              token: transferredAmount || '--',
              isLoading,
            })}
            {getToken({
              tokenName: 'Start Time',
              token: startTime ? new Date(startTime).toLocaleString() : '--',
              isLoading,
            })}
            {getToken({
              tokenName: 'Eend Time',
              token: endTime ? new Date(endTime).toLocaleString() : '--',
              isLoading,
            })}
          </Sections>
        </MiddleContent>

        <MiddleContent className="balance-container">
          <SectionHeader>Releasable Amount</SectionHeader>
          <Sections>
            {getToken({
              tokenName: 'Amount',
              token: releasableAmount || '--',
              isLoading,
            })}
          </Sections>
        </MiddleContent>
      </div>

      <WriteFunctionalityContainer>
        <Button type="primary" onClick={onWithdraw} loading={isWithdrawLoading}>
          Withdraw
        </Button>
      </WriteFunctionalityContainer>
    </BuOlasContainer>
  );
};

BuOlas.propTypes = {
  account: PropTypes.string,
  chainId: PropTypes.number,
};

BuOlas.defaultProps = {
  account: null,
  chainId: null,
};

const mapStateToProps = (state) => {
  const { account, chainId } = state.setup;
  return { account, chainId };
};

export default connect(mapStateToProps, null)(BuOlas);
