import { Typography } from 'antd/lib';

const { Title } = Typography;

const Leaderboard = () => (
  <div id="section-leaderboard">
    <Title level={2}>Leaderboard</Title>
    <p>
      As mentioned above, El Collectooorr is designed to exchange a user’s ETH
      for collection fractions (in the form of ERC-20 tokens). A collection is
      designed to have 10,000 ERC-20 tokens. In that case, as the price is
      calculated from the target budget for a collection, each fraction would
      represent 0.0001 ETH of the collection. (If the budget is 10 ETH, the
      supply of the token is 10,000 → 10 / 10,000 = 0.0001 ETH per token).
    </p>

    <p>
      The collection fractions are designed to be specific to the collection,
      remaining the same no matter how many NFTs the collection contains. On
      creation of a collection fraction supply, El Collectooorr defaults to
      setting the initial reserve price at double the default target budget,
      i.e. 20 ETH. This aims to ensure that El Collectooorr can reach its
      funding target and cover costs even if a collection is bought before the
      full budget can be raised. Logical parameters are crucial for El
      Collectooorr to continue to operate autonomously without human
      intervention. The idea is that the more collection fractions that are held
      by funders, the less influence El Collectooorr has on the reserve price
      and, by extension, the more voting power the community has. Once all
      fractions are held by funders, these fraction holders would have full
      collective control of the reserve price. Voting on the reserve price can
      be done via&nbsp;
      <a
        href="https://fractional.art/"
        target="_blank"
        rel="noopener noreferrer"
      >
        fractional.art
      </a>
      .
    </p>

    <p>
      Because the ETH that is exchanged for tokens is intended for minting NFTs,
      one cannot use the tokens to claim back their ETH. It is a one-way
      exchange. Secondary markets may emerge, however, in the form of liquidity
      pools, where collection tokens can be freely traded.
    </p>

    <br />
    <br />
    <br />
  </div>
);

export default Leaderboard;
