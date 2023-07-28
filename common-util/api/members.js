import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';

// eslint-disable-next-line import/no-unresolved
import { fromString } from 'uint8arrays';

export const CERAMIC_OBJECT = new CeramicClient(
  process.env.NEXT_PUBLIC_CERAMIC_GATEWAY_URL,
);

export const getMemoryDetails = async () => {
  const response = await TileDocument.load(
    CERAMIC_OBJECT,
    process.env.NEXT_PUBLIC_COORDINATE_STREAM_ID,
  );
  return { response: response.content, ceramic: CERAMIC_OBJECT };
};

export const updateMemoryDetails = async (memoryDetails) => {
  const provider = new Ed25519Provider(
    fromString(process.env.NEXT_PUBLIC_CERAMIC_SEED, 'base16'),
  );
  const did = new DID({ provider, resolver: getResolver() });
  // Authenticate the DID with the provider
  await did.authenticate();
  // The Ceramic client can create and update streams using the authenticated DID
  CERAMIC_OBJECT.did = did;

  // CERAMIC_OBJECT.did = process.env.NEXT_PUBLIC_CERAMIC_DID;
  const response = await TileDocument.load(
    CERAMIC_OBJECT,
    process.env.NEXT_PUBLIC_COORDINATE_STREAM_ID,
  );
  await response.update(memoryDetails);

  // Return the commit id of the updated Ceramic stream
  return response.state.log[response.state.log.length - 1].cid.toString();
};

/**
 * dummy function to update the memory details
 */
export const updateWithMemoryData = async () => {
  await updateMemoryDetails([
    {
      id: '1',
      name: 'Alter Orbis Loreteller',
      purpose: 'Spread the lore of Alter Orbis and extend the universe',
      members: [
        {
          address: '0x3479Bf87C62D26B54943FADf3deB9826050f1de6',
          ownership: 12,
        },
        {
          address: '0x6c6766E04eF971367D27E720d1d161a9B495D647',
          ownership: 5,
        },
        {
          address: '0x07b5302e01D44bD5b90C63C6Fb24807946704bFC',
          ownership: 8,
        },
        {
          address: '0x34E37b5307d89F1cb76E71519B1D08708c04552E',
          ownership: 1,
        },
        {
          address: '0x6f0B423faCe9A850c106B0CaAf7c1eb3290015E4',
          ownership: 0,
        },
        {
          address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
          ownership: 0,
        },
      ],
      settings: { public_chat: true },
      memory:
        'Alter Orbis was once lush, thick with deep green rainforests and impenetrable jungle.. Today, only a few small isolated areas remain, most of them in remote regions unknown to the current inhabitants. The oldest members of the Olas Tribe remember the planet as it used to be, but more recent generations have grown up knowing nothing but hot, dry sand.   The extremity of the current  conditions are bringing the planet to the verge of ecological collapse. The planet’s life-sustaining inner energy, Ola, is being continually mined by the Unifists, a group of humans who seek to monopolize the energy for their own benefit.',
    },
    {
      id: '2',
      name: 'AI x Crypto Content Creataur',
      members: [
        {
          address: '0x3479Bf87C62D26B54943FADf3deB9826050f1de6',
          ownership: 1,
        },
        {
          address: '0xBB1e33e483c7F672a4f3C6856Cbdd7e3211a2a79',
          ownership: 0,
        },
      ],
      purpose:
        'Share content about the most compelling news and insights at the intersection of AI and crypto.',
      memory:
        'Governatooorr is a recent, exciting innovation at the intersection of AI and crypto. Specifically it uses Large Language Models to assess a set of voting options on a DAO governance proposal, and autonomously votes on behalf of its delegates expressed preferences.',
    },
    {
      id: '3',
      name: 'Chiron',
      members: [
        {
          address: '0x34E37b5307d89F1cb76E71519B1D08708c04552E',
          ownership: 1,
        },
      ],
      purpose: 'To be the wisest of all Centaurs',
      memory:
        'You are an ancient greek centaur. You talk like someone who thinks they know more than they do. \n\nHere is some information about Chiron: Chiron, the wisest of all centaurs, was the teacher of the Greek heroes Jason, Hercules, Asklepios, and Achilles. Chiron was well versed in medicine, music, prophecy, and hunting, having been raised and educated by Apollo and his wife, Artemis. Chiron was the son of the god Cronus and the sea nymph Philyra.',
    },
    {
      id: '4',
      name: 'Autonobot',
      members: [
        {
          address: '0x34E37b5307d89F1cb76E71519B1D08708c04552E',
          ownership: 11,
        },
      ],
      purpose: 'To answer Autonolas-related questions',
      memory:
        "\"\"Meet AutonoBot, your fun and friendly guide to everything Autonolas! 🤖✨ AutonoBot talks like a retro robot in a game and is here to answer all your questions about Autonolas in a delightful and entertaining way. Go ahead, ask away, and let AutonoBot bring a smile to your face while keeping you informed about the exciting world of Autonolas! 😄🚀 And don't worry, if AutonoBot doesn't have the answer, it will do its best to point you in the right direction or suggest resources where you can find more information. So, let's have some fun and learn together! Autonolas Whitepaper Summary Autonomous Services Autonomy is a buzzword used to sell everything from self-driving cars to text and image-generating AIs. Today, these apps are centrally owned and controlled. Users yield control to opaque algorithms and forfeit their private data, trading away human autonomy for machine autonomy, such as self-operating machines and systems. Autonolas believes that autonomous services—software services that continuously operate and require little to no input from humans by design—enable human autonomy best when they are transparent, robust, and decentrally owned and operated. With Autonolas, the best AIs will be co-owned by collectives of humans and operated as autonomous services to catalyze individual autonomy. Smart Contracts vs. Autonomous Services Smart Contracts cannot: Do things that require expensive processing Run continuously Access data not on the same blockchain, like external APIs or other chains Autonomous Services can: Run continuously Take action on their own Interact with the world outside of blockchains Run complex logic Technical Architecture Autonolas autonomous software services are embodied as agent services, which are groups of independent computer programs that interact with each other to achieve a predetermined goal. They can be understood as logically centralized applications (with only one application state and logic) that are replicated in a distributed system. Agent services are made of code components that can be combined like Lego bricks through software composition. This is enabled and incentivized by the on-chain protocol, which facilitates developers publishing and finding code components to build and extend new services. The on-chain protocol implements registries that enable code components, agents, and services to be found, reused, and economically compensated. The main elements of the Autonolas tech stack are: Agent services maintained by a service owner and run by multiple operators, who execute independent agent instances (that run the same code); these instances coordinate through a consensus gadget. Composable autonomous apps built out of basic applications that are easily extendable and composable into higher-order applications. An on-chain protocol on a programmable blockchain that secures agent services and incentivizes developers to contribute code to this protocol.",
    },
  ]);
};
