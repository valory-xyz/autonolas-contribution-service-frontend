import { Typography } from 'antd/lib';

const { Title } = Typography;

const Badge = () => (
  <div id="section-badge">
    <Title level={2}>Badge</Title>
    <p>
      In its current form, El Collectooorr is designed to mint NFTs from Art
      Blocks drops and adds them to collections, minting NFTs for only one
      collection at a time. Each collection has a target budget of 10 ETH. This
      10 ETH is used to purchase NFTs and pay for the transaction cost of doing
      so.
    </p>

    <p>
      El Collectoorr is set to finish collecting for the completed collection
      once the target spend is reached, before beginning to collect for the next
      one. As above, any funds El Collectooorr uses to mint NFTs for the current
      collection are contributed by users exchanging their ETH via the
      collection’s webpage. 10 ETH was chosen as the initial budget with the
      aims of being high enough to make it worthwhile, relative to the gas costs
      of operating, whilst not being so high as to needlessly postpone community
      ownership and decision-making.
    </p>

    <p>
      Nevertheless, this does not mean that a full 10 ETH needs to be raised for
      El Collectooorr to begin collecting for the collection. In fact, as soon
      as someone contributes to a new collection by adding funds and there is
      enough to begin minting, El Collectooorr may start to fill up the
      collection with freshly minted NFTs.
    </p>
    <br />
    <br />
    <br />
  </div>
);

export default Badge;
