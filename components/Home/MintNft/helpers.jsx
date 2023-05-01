import { Space, Typography } from 'antd/lib';
import Image from 'next/image';
import { MintBadgeCardContainer } from './styles';

const { Text } = Typography;

export const MintBadgeCard = () => (
  <MintBadgeCardContainer>
    <Space direction="vertical">
      <Space style={{ display: 'flex', flexDirection: 'column' }}>
        <Image
          priority
          src="/images/showcase-nft.png"
          alt="Mint NFT"
          width={220}
          height={180}
          className="mint-nft-image"
        />
      </Space>

      <Text strong>
        Mint your Autonolas badge, watch it evolve as you contribute
      </Text>
      <Text type="secondary">To mint, connect a wallet.</Text>
    </Space>
  </MintBadgeCardContainer>
);
