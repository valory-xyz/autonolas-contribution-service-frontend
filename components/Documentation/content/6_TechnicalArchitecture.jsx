import { Anchor } from 'common-util/Anchor';
import { Check, X } from 'react-feather';
import { COLOR } from 'util/theme';
import { ComparisonTable } from '../styles';

const Yes = () => <Check color={COLOR.GREEN_2} />;

const No = () => <X color={COLOR.GREY_2} />;

const DATA_ROWS = [
  {
    id: 'location',
    name: 'LOCATION',
    smartContractApp: true,
    humanOperation: false,
    autonomousService: true,
  },
  {
    id: 'decentralized',
    name: 'DECENTRALIZED',
    smartContractApp: true,
    humanOperation: false,
    autonomousService: true,
  },
  {
    id: 'robust',
    name: 'ROBUST',
    smartContractApp: true,
    humanOperation: false,
    autonomousService: true,
  },
  {
    id: 'transparent',
    name: 'TRANSPARENT',
    smartContractApp: true,
    humanOperation: false,
    autonomousService: true,
  },
  {
    id: 'composable',
    name: 'COMPOSABLE',
    smartContractApp: true,
    humanOperation: false,
    autonomousService: true,
  },
  {
    id: 'complex-processing',
    name: 'COMPLEX PROCESSING',
    smartContractApp: false,
    humanOperation: true,
    autonomousService: true,
  },
  {
    id: 'cross-chain',
    name: 'CROSS CHAIN',
    smartContractApp: false,
    humanOperation: true,
    autonomousService: true,
  },
  {
    id: 'continous-on',
    name: 'CONTINOUS / ALWAYS ON',
    smartContractApp: false,
    humanOperation: true,
    autonomousService: true,
  },
];

const getChainType = (type) => (type ? 'ON-CHAIN' : 'OFF-CHAIN');

const Table = () => (
  <ComparisonTable>
    <table>
      <thead>
        <tr>
          <th aria-label=" " />
          <th>Smart Contract Apps</th>
          <th>Human/Bot Operations</th>
          <th>Autonomous Services</th>
        </tr>
      </thead>
      <tbody>
        {DATA_ROWS.map(
          ({
            id,
            name,
            smartContractApp,
            humanOperation,
            autonomousService,
          }) => {
            if (id === 'location') {
              return (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{getChainType(smartContractApp)}</td>
                  <td>{getChainType(humanOperation)}</td>
                  <td>{getChainType(autonomousService)}</td>
                </tr>
              );
            }

            return (
              <tr key={id}>
                <td>{name}</td>
                <td>{smartContractApp ? <Yes /> : <No />}</td>
                <td>{humanOperation ? <Yes /> : <No />}</td>
                <td>{autonomousService ? <Yes /> : <No />}</td>
              </tr>
            );
          },
        )}
      </tbody>
    </table>
  </ComparisonTable>
);

const AutonolasService = () => (
  <div id="sub-section-autonals-service">
    <h3 id="autonomous-service-autonolas">Autonomous Service: Autonolas </h3>
    <p>
      El Collectooorr is powered by
      <Anchor text="Autonolas" url="https://www.autonolas.network/" />
      .
      Autonolas is a versatile toolkit for creating and running rich,
      decentralized and autonomous services that augment the possibilities of
      blockchain and distributed ledger technologies.
    </p>
    <p>
      Why use an autonomous service? Autonomous services enable us to build with
      the power and flexibility of Web 2, and the security and composability of
      Web 3. Have a look at the table below for a better understanding:
    </p>

    <Table />
    <br />

    <p>
      El Collectooorr is a service made up of multiple
      <Anchor
        text="ABCI apps"
        url="https://docs.tendermint.com/master/spec/abci/"
      />
      . ABCI stands for Application Blockchain Interface and these apps are
      sub-services within the main El Collectooorr autonomous service. The apps
      use this interface to connect to a Tendermint consensus engine. These ABCI
      apps were developed with the Autonolas
      <Anchor
        text="Open AEA framework"
        url="https://valory-xyz.github.io/open-aea/"
        hasSpaceSuffix
      />
      and are run by
      <Anchor
        text="Autonolas agent operators"
        url="#autonolas-agent-operators"
        target="_self"
      />
      . There are three ABCI apps that make up El Collectooorr: the Funding ABCI
      app, the Minter ABCI app, and the Fractional ABCI app.
    </p>
    <br />

    <h3 id="funding-abci-app">1. Funding ABCI App</h3>
    <p>
      This app is designed to manage the funds. Whenever a user sends ETH to El
      Collectooorr, it aims to calculate how many collection fractions a user
      should receive - taking into account the management fee - and aims to send
      them as quickly as possible. It also aims to prevent El Collectooorr from
      spending the ETH reserved for the creation of the next Fractional vault,
      for hosting the next collection.
    </p>
    <br />

    <h3 id="minter-abci-app">2. Minter ABCI App</h3>
    <p>
      This app uses a decision-making algorithm to decide which Art Blocks drops
      to participate in and is designed to perform the transactions necessary
      for purchasing the desired NFT during the auctions.
    </p>
    <p>
      The algorithm is designed to check how much of the supply of a new drop
      has been minted. If over 80% of a drop is minted, then El Collectooorr
      tries to mint the NFTs in the drop, up to a limit of three. This strategy
      acknowledges that many Art Blocks drops happen via Dutch auction. In Dutch
      auctions, the price starts high and then descends until someone makes a
      bid. The assumption here is that when 80% of the supply of a drop has
      already been bought, 1) it is a drop that is in high demand and 2) it is
      likely that the current mint price is less than the average mint price.
    </p>
    <br />

    <h3 id="fractional-abci-app">Fractional ABCI App</h3>
    <p>
      This app is designed to deploy fractional vault smart contracts. It also
      aims to handle transactions related to sending newly minted NFTs from the
      safe contract to the current vault contract.
    </p>

    <p>These three apps chain together to make up El Collectooorr.</p>
    <br />

    <h3 id="autonolas-agent-operators">Autonolas Agent Operators</h3>
    <p>
      The autonomous service powering El Collectooorr is run on the Autonolas
      protocol by multiple independent operators. No single operator controls
      any user’s funds. Autonolas allows El Collectooorr to run complex logic –
      like knowing what price to buy NFTs at – and identifying when a new drop
      goes live. For more information on the Autonolas network and on becoming
      an agent operator, get in touch via the Autonolas
      <Anchor text="Discord" url="https://discord.com/invite/z2PT65jKqQ" />
      .
    </p>
    <br />
  </div>
);

const TechnicalArchitecture = () => (
  <div id="section-technical-architecture">
    <h2>Technical Architecture</h2>
    <h3 id="on-chain-components">On-chain components</h3>
    <p>
      El Collectooorr currently interacts with 4 on-chain components. The
      service is secured by the Autonolas protocols and it interacts with three
      types of smart contracts: Gnosis Safe, Art blocks and Fractional vault.
    </p>
    <br />
    <h3 id="autonolas-protocol">Autonolas Protocol</h3>
    <p>
      Autonolas is the first crypto-native stack for building decentralized
      autonomous services. The on-chain protocol serves as a registry for
      tracking various aspects of a service including the creator, its operators
      and its usage. For more information on the Autonolas network and on
      becoming an agent operator, get in touch via the Autonolas
      <Anchor text="Discord" url="https://discord.com/invite/z2PT65jKqQ" />
    </p>
    <br />
    <h3 id="gnosis-safe">Gnosis Safe</h3>
    <p>
      <Anchor
        text="The Safe"
        url="https://docs.gnosis-safe.io/"
        hasSpacePrefix={false}
        hasSpaceSuffix
      />
      is a smart contract wallet with multi-signature functionality at its core.
      It is the multisig through which El Collectooorr performs its on-chain
      transactions. The signatories of the multisig are independent
      <Anchor
        text="service operators"
        url="#autonolas-agent-operators"
        hasSpaceSuffix
        target="_self"
      />
      , allowing for a high degree of security.
    </p>
    <br />
    <h3 id="art-blocks">Art Blocks </h3>
    <p>
      The
      <Anchor
        text="Art Blocks"
        url="https://docs.artblocks.io/"
        hasSpaceSuffix
      />
      platform hosts generative art projects. Each project is made up of a
      series of NFTs which users can mint on the platform. El Collectooorr
      interacts with this minting contract using its Gnosis Safe to purchase
      NFTs for its collections.
    </p>
    <br />
    <h3 id="fractional">Fractional</h3>
    <p>
      <Anchor
        text="Fractional"
        url="https://docs.fractional.art/fractional/"
        hasSpacePrefix={false}
        hasSpaceSuffix
      />
      is a decentralized protocol where NFT owners can mint tokenized fractional
      ownership of their NFT collections. These tokens then function as normal
      ERC20 tokens which have governance over the NFTs that they own. El
      Collectooorr uses Fractional’s vault smart contracts to hold its
      collections. It is the ERC-20 tokens from these vaults that El
      Collectooorr distributes as collection tokens.
    </p>
    <br />

    <AutonolasService />
  </div>
);

export default TechnicalArchitecture;
