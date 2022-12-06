import { Typography } from 'antd/lib';

const { Title } = Typography;

const Overview = () => (
  <>
    <div id="section-overview">
      <Title level={2}>Overview</Title>

      <br />
      <p>El Collectooorr is a novel experiment in crypto art collection.</p>
      <br />
      <p>
        El Collectooorr aims to autonomously create collections of NFTs by
        minting them as they drop on Art Blocks. It uses complex logic to decide
        which mints to participate in and what prices to bid at, so users don’t
        have to. The service is fueled by the community of users who fund
        collections. Each collection is designed to have its own unique ERC-20
        token, for users to vote and collectively decide on what happens to the
        collection.
      </p>
      <br />
      <h3 id="user-benefits">User Benefits</h3>
      <p>
        El Collectooorr aims to provide three main benefits: to save users time
        and effort, to make NFT art collecting more accessible and to broaden
        users’ NFT exposure.
      </p>
      <br />
      <h3 id="time-and-effort-saved">Time and effort saved:</h3>
      <p>
        El Collectooorr does its own research, monitoring and minting. As a
        user, you don’t need to decide what drops to participate in. El
        Collectooorr contains an algorithm to decide whether and at what prices
        to mint at. Moreover, El Collectooorr aims to run continuously at any
        time of day. Lastly, it is designed to try to beat other buyers and bots
        and buy at a good time and price. Put simply, El Collectooorr takes a
        lot off of your plate.
      </p>
      <br />
      <h3 id="making-nft-art-collecting-more-accessible">
        Making NFT art collecting more accessible:
      </h3>
      <p>
        The mint price of many Art Blocks drops and the price of transacting on
        Ethereum mean that art collecting has a high barrier of entry. By
        enabling users to pool their funds, El Collectooorr aims to reduce those
        barriers.
      </p>
      <br />
      <h3 id="broadening-users-nft-exposure">
        Broadening users’ NFT exposure:
      </h3>
      <p>
        Through the fractionalization of NFTs from multiple drops, El
        Collectooorr aims to broaden users’ exposure and increase the liquidity
        of the NFTs in the collections.
      </p>
      <br />
      <br />
      <br />
    </div>
  </>
);

export default Overview;
