import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import {
  Alert, Button, Image, Typography, Skeleton,
} from 'antd/lib';
import { LinkOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import { isGoerli } from 'common-util/functions';
import { getLatestMintedNft } from 'common-util/api';

import { DOCS_SECTIONS } from 'components/Documentation/helpers';
import { setNftDetails } from 'store/setup/actions';
import { mintNft, getAutonolasTokenUri, pollNftDetails } from './utils';
import { DiscordLink } from '../common';
import {
  IMAGE_SIZE,
  MintNftContainer,
  WriteFunctionalityContainer,
} from './styles';

const { Title, Text } = Typography;

const MintNft = () => {
  const [isNftFetchingLoading, setNftFetchingLoading] = useState(false);
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const nftDetails = useSelector((state) => state?.setup?.nftDetails);
  const dispatch = useDispatch();

  // loader for minting
  const [isMintingLoading, setIsMintingLoading] = useState(false);

  // loader for signing the mint (between mint start & complete)
  const [isBadgePollLoading, setIsBadgePollLoading] = useState(false);
  const openSeaUrl = isGoerli(chainId)
    ? 'https://testnets.opensea.io/assets/goerli/0x7c3b976434fae9986050b26089649d9f63314bd8'
    : 'https://opensea.io/assets/ethereum/0x02c26437b292d86c5f4f21bbcce0771948274f84';

  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        setNftFetchingLoading(true);

        try {
          const { details, tokenId } = await getLatestMintedNft(account);
          dispatch(setNftDetails({ tokenId, ...(details || {}) }));
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

  // TODO: to be button
  const connectButton = 'connect wallet';

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
                  {nftDetails?.tokenId && (
                    <Text type="secondary" className="mt-12">
                      <a
                        href={`${openSeaUrl}/${nftDetails.tokenId}`}
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
                  <Text
                    type="secondary"
                    className="custom-text-secondary mt-12"
                  >
                    Free to mint! Only cost is gas.
                  </Text>
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

export default MintNft;
