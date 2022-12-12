import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import {
  Alert, Button, Image, Typography, Skeleton,
} from 'antd/lib';
import { LinkOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { DOCS_SECTIONS } from 'components/Documentation/helpers';
import {
  getLatestMintedNft,
  mintNft,
  getAutonolasTokenUri,
  pollNftDetails,
} from './utils';
import { DiscordLink } from '../common';
import {
  IMAGE_SIZE,
  MintNftContainer,
  WriteFunctionalityContainer,
} from './styles';

const { Title, Text } = Typography;
const IMAGE_URL = 'https://testnets.opensea.io/assets/goerli/0x7c3b976434fae9986050b26089649d9f63314bd8';

const MintNft = ({ account, chainId }) => {
  const [tokenId, setTokenId] = useState(null);
  const [isNftFetchingLoading, setNftFetchingLoading] = useState(false);
  const [nftDetails, setNftDetails] = useState(null);

  // loader for minting
  const [isMintingLoading, setIsMintingLoading] = useState(false);

  // loader for signing the mint (between mint start & complete)
  const [isBadgePollLoading, setIsBadgePollLoading] = useState(false);

  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        setNftFetchingLoading(true);

        try {
          const {
            isFound,
            response,
            tokenId: id,
          } = await getLatestMintedNft(account);

          if (isFound) {
            const details = await fetch(response);
            const json = await details.json();
            setTokenId(id);
            setNftDetails(json);
          } else {
            setTokenId(null);
            setNftDetails(null);
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
        const id = await mintNft(account);

        // once minted, poll the details
        setIsBadgePollLoading(true);
        const response = await pollNftDetails(id);
        setNftDetails(response);
        setIsBadgePollLoading(false);
      } catch (error) {
        window.console.error(error);
      } finally {
        setIsMintingLoading(false);
        setIsBadgePollLoading(false);
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
      <Text type="secondary" className="custom-text-secondary">
        Show off your leaderboard rank and promote Autonolas with a badge that
        evolves as you contribute.&nbsp;
        <Link href={`/docs#${DOCS_SECTIONS.badge}`}>Learn more</Link>
      </Text>

      {isNftFetchingLoading ? (
        <>
          <Skeleton.Image active className="skeleton-image-loader" />
          <Text type="secondary" className="custom-text-secondary mt-12">
            Your badge is being generated. This can take up to 2 minutes.
          </Text>
          <Text type="secondary" className="custom-text-secondary">
            <DiscordLink />
            &nbsp;while you wait!
          </Text>
        </>
      ) : (
        <>
          {account ? (
            <>
              {image ? (
                <>
                  <Image
                    src={getAutonolasTokenUri(image)}
                    alt="NFT"
                    width={IMAGE_SIZE}
                    height={IMAGE_SIZE}
                    className="nft-image"
                    preview={false}
                  />
                  {tokenId && (
                    <Text type="secondary" className="mt-12">
                      <a
                        href={`${IMAGE_URL}/${tokenId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View on OpenSea&nbsp;
                        <LinkOutlined />
                      </a>
                    </Text>
                  )}
                  <Text
                    type="secondary"
                    className="custom-text-secondary mt-12"
                  >
                    Your badge automatically updates as you complete actions and
                    earn points!
                  </Text>
                  <Text type="secondary" className="custom-text-secondary">
                    Set your NFT as your PFP on social apps like Twitter, Lens,
                    Farcaster and Orbis.
                  </Text>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    onClick={onMintBadge}
                    loading={isNftFetchingLoading || isMintingLoading}
                    disabled={isNftFetchingLoading || isMintingLoading}
                  >
                    {isBadgePollLoading ? 'Generating' : 'Mint Badge'}
                  </Button>
                  {isBadgePollLoading && (
                    <Text
                      type="secondary"
                      className="custom-text-secondary mt-12"
                    >
                      Your badge can take a while to generate. While you
                      wait,&nbsp;
                      <DiscordLink text="complete Discord verification" />
                      &nbsp;to activate it
                    </Text>
                  )}
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
