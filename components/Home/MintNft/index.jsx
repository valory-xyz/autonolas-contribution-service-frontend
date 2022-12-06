import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Alert, Button, Image, Typography, Skeleton,
} from 'antd/lib';
import PropTypes from 'prop-types';
// import get from 'lodash/get';
import { get } from 'lodash';
import { getLatestMintedNft, getAutonolasTokenUri } from './utils';
import { MintNftContainer, WriteFunctionalityContainer } from './styles';

const { Title, Text } = Typography;

const MintNft = ({ account, chainId }) => {
  const [isMintingLoading, setIsMintingLoading] = useState(true);
  const [nftDetails, setNftDetails] = useState(null);

  const [isNftFetchingLoading, setNftFetchingLoading] = useState(false);

  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        setNftFetchingLoading(true);

        try {
          const { isFound, response } = await getLatestMintedNft(account);
          if (isFound) {
            const details = await fetch(response);
            const json = await details.json();
            setNftDetails(json);
          }
        } catch (error) {
          window.console.error(error);
        } finally {
          setNftFetchingLoading(false);
        }
      }
    };
    fn();
  }, [account, chainId]);

  /**
   * function to mint badge
   */
  const onMintBadge = async () => {
    if (account && chainId) {
      setIsMintingLoading(true);
      try {
        // await withdraw({ account, chainId });
      } catch (error) {
        window.console.error(error);
      } finally {
        setIsMintingLoading(false);
      }
    }
  };

  // TODO:
  const handleConnectWallet = () => {};

  const connectButton = (
    <Button type="link" onClick={handleConnectWallet}>
      connect wallet
    </Button>
  );

  const image = get(nftDetails, 'image');

  return (
    <MintNftContainer>
      <Title level={2}>Badge</Title>
      <Text type="secondary" className="mb-12">
        Show off your leaderboard rank and promote Autonolas with a badge that
        evolves as you contribute.&nbsp;
        <a
          href="https://www.autonolas.network/"
          target="_blank"
          rel="noreferrer"
        >
          Learn more
        </a>
      </Text>

      {isNftFetchingLoading ? (
        <Skeleton.Image
          active
          style={{
            width: 300,
            height: 300,
          }}
        />
      ) : (
        <>
          {account ? (
            <>
              {image ? (
                <>
                  <Image
                    src={getAutonolasTokenUri(image)}
                    alt="NFT"
                    width={300}
                    height={300}
                    className="nft-image"
                    preview={false}
                  />
                  <Text type="secondary" className="mb-12 mt-12">
                    Your badge automatically updates as you complete actions and
                    earn points!
                  </Text>
                  <Text type="secondary">
                    Set your NFT as your PFP on social apps like Twitter, Lens,
                    Farcaster and Orbis.
                  </Text>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    onClick={onMintBadge}
                    loading={isMintingLoading}
                    disabled={isMintingLoading}
                  >
                    Mint Badge
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Alert
                type="info"
                className="connect-wallet-info"
                message={(
                  <div>
                    <p>NEW: Mint your Autonolas Badge!</p>
                    <p style={{ display: 'inline-block' }}>
                      To get started,&nbsp;
                      {connectButton}
                      .
                    </p>
                  </div>
                )}
              />
              <Text type="secondary">
                To mint or see your badge,&nbsp;
                {connectButton}
                .
              </Text>
            </>
          )}
        </>
      )}

      <WriteFunctionalityContainer />
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
