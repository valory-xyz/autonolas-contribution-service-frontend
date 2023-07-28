import { IMAGE_SIZE } from 'components/Home/MintNft/styles';
import { getAutonolasTokenUri } from 'components/Home/MintNft/utils';
import {
  Image, Typography,
} from 'antd/lib';
import { LinkOutlined } from '@ant-design/icons';
import { isGoerli } from '@autonolas/frontend-library';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const { Text } = Typography;

const ShowBadge = ({ image, nftDetails }) => {
  const chainId = useSelector((state) => state?.setup?.chainId);
  const openSeaUrl = isGoerli(chainId)
    ? 'https://testnets.opensea.io/assets/goerli/0x7c3b976434fae9986050b26089649d9f63314bd8'
    : 'https://opensea.io/assets/ethereum/0x02c26437b292d86c5f4f21bbcce0771948274f84';

  return (
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
    </>
  );
};

ShowBadge.propTypes = {
  image: PropTypes.string.isRequired,
  nftDetails: PropTypes.shape({
    tokenId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),
};

ShowBadge.defaultProps = {
  nftDetails: null,
};

export default ShowBadge;
