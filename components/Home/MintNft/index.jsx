import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Typography, Skeleton } from 'antd/lib';
import get from 'lodash/get';
import { setNftDetails } from 'store/setup/actions';
import { getLatestMintedNft } from 'common-util/api';
import { EducationTitle } from './Education';
import ShowBadge from './ShowBadge';
import { mintNft, pollNftDetails } from './utils';
import { DiscordLink } from '../common';
import { MintBadgeCard } from './helpers';
import { MintNftContainer, WriteFunctionalityContainer } from './styles';

const { Text } = Typography;

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

  const image = get(nftDetails, 'image');

  return (
    <MintNftContainer>
      <EducationTitle title="Badge" level={3} educationItemSlug="badge" />

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
                  <ShowBadge image={image} nftDetails={nftDetails} />
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
                  {isBadgePollLoading ? (
                    <Text
                      type="secondary"
                      className="custom-text-secondary mt-12"
                    >
                      Your badge can take a while to generate. While you
                      wait,&nbsp;
                      <DiscordLink text="complete Discord verification" />
                      &nbsp;to activate it
                    </Text>
                  ) : (
                    <Text
                      type="secondary"
                      className="custom-text-secondary mt-12"
                    >
                      Free to mint! Only cost is gas.
                    </Text>
                  )}
                </>
              )}
            </>
          ) : (
            <MintBadgeCard />
          )}
        </>
      )}

      <WriteFunctionalityContainer />
    </MintNftContainer>
  );
};

export default MintNft;
