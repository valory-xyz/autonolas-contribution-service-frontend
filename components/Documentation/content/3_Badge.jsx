import { Typography } from 'antd/lib';

const { Title, Paragraph } = Typography;

const Badge = () => (
  <div id="section-badge">
    <Title level={2}>Badge</Title>
    <Paragraph>
      Community members’ points will start showing up on the leaderboard after
      they have registered.
    </Paragraph>
    <Paragraph>
      Community members can mint an Autonolas Badge. Badges are fun visual
      representation of community contributions. Badges are NFTs following the
      ERC-721 standard. Badges update when community members earn points. This
      happens automatically at regular intervals. The updates are done by a
      decentralized, off-chain service powered by Autonolas.
    </Paragraph>
    <Paragraph>
      If actions change, you do not lose points and your badge does not
      downgrade.
    </Paragraph>
    <Title level={5}>Mint your badge</Title>
    <Paragraph>
      <ol>
        <li>Go to the homepage.</li>
        <li>
          Connect a Web3 wallet. The website supports MetaMask and
          WalletConnect-enabled wallets.
        </li>
        <li>Under “Badge”, click “Mint Badge”.</li>
        <li>
          Follow the instructions in your wallet to submit the minting
          transaction. Badges are NFTs on mainnet Ethereum. There is no fee to
          mint a badge, but the minting transaction requires that you pay ETH to
          fund the cost of gas.
        </li>
        <li>Wait for the transaction to complete.</li>
        <li>If necessary, refresh the page. </li>
        <li>You should now see your badge on the website.</li>
      </ol>
    </Paragraph>
    <Title level={5}>Badge tiers</Title>
    There are several badge tiers, and each has a different shape:
    <Paragraph>
      <ol>
        <li>
          Idle – badge is not activated. Register your profile to activate.
        </li>
        <li>Basic – 0 – 50k points</li>
        <li>Legendary – 50k – 100k points</li>
        <li>Epic – 100k+ points</li>
      </ol>
    </Paragraph>
    <br />
    <br />
    <br />
  </div>
);

export default Badge;
