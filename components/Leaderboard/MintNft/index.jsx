import { Button, Typography } from 'antd';
import get from 'lodash/get';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BadgeLoading, ShowBadge } from 'common-util/ShowBadge';
import { getLatestMintedNft } from 'common-util/api';
import { setNftDetails } from 'store/setup';

import { DiscordLink } from '../common';
import { EducationTitle } from './Education';
import { MintBadgeCard } from './helpers';
import { MintNftContainer, WriteFunctionalityContainer } from './styles';
import { mintNft, pollNftDetails } from './utils';

const { Text } = Typography;

export const MintNft = () => {
  const [isNftFetchingLoading, setNftFetchingLoading] = useState(false);
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const nftDetails = useSelector((state) => state?.setup?.nftDetails);
  const dispatch = useDispatch();

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
  }, [account, chainId, dispatch]);

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
        dispatch(setNftDetails({ tokenId: id, ...response }));
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
          <BadgeLoading />
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
                <ShowBadge image={image} tokenId={nftDetails.tokenId} />
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
                    <Text type="secondary" className="custom-text-secondary mt-12">
                      Your badge can take a while to generate. While you wait,&nbsp;
                      <DiscordLink text="complete Discord verification" />
                      &nbsp;to activate it
                    </Text>
                  ) : (
                    <Text type="secondary" className="custom-text-secondary mt-12">
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
