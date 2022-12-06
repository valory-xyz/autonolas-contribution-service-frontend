/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Image } from 'antd/lib';
import PropTypes from 'prop-types';
// import get from 'lodash/get';
import { get } from 'lodash';
import { getToken } from '../common';
import { getLatestMintedNft, getAutonolasTokenUri } from './utils';
import { MiddleContent, SectionHeader, Sections } from '../styles';
import { MintNftContainer, WriteFunctionalityContainer } from './styles';

const MintNft = ({ account, chainId }) => {
  // balances
  const [isLoading, setIsLoading] = useState(true);
  const [nftDetails, setNftDetails] = useState(null);

  // withdraw
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);

  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        setIsLoading(true);
        try {
          const { isFound, response } = await getLatestMintedNft(account);
          if (isFound) {
            const details = await fetch(response);
            console.log(details);
            const json = await details.json();
            setNftDetails(json);
          }
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
        // await withdraw({ account, chainId });
      } catch (error) {
        window.console.error(error);
      } finally {
        setIsWithdrawLoading(false);
      }
    }
  };

  const image = get(nftDetails, 'image');

  return (
    <MintNftContainer>
      <div className="left-content">
        <MiddleContent className="balance-container">
          <SectionHeader>Locked Balances</SectionHeader>
          <Sections>
            {/* {getToken({
              tokenName: 'Amount',
              token: amount || '--',
              isLoading,
            })} */}
          </Sections>
        </MiddleContent>
      </div>

      <WriteFunctionalityContainer>
        <Button type="primary" onClick={onWithdraw} loading={isWithdrawLoading}>
          Mint Badge
        </Button>

        {image && (
          <Image
            src={getAutonolasTokenUri(image)}
            alt="NFT"
            width={400}
            height={400}
            // onError={() => setImageSize(SMALL_SIZE)}
            data-testid="nft-image"
          />
        )}
      </WriteFunctionalityContainer>
    </MintNftContainer>
  );
};

MintNft.propTypes = {
  account: PropTypes.string,
  chainId: PropTypes.number,
};

MintNft.defaultProps = {
  account: null,
  chainId: null,
};

const mapStateToProps = (state) => {
  const { account, chainId } = state.setup;
  return { account, chainId };
};

export default connect(mapStateToProps, null)(MintNft);
