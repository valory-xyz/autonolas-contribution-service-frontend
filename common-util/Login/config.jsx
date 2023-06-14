import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { configureChains, createConfig } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';

export const chains = (process.env.NEXT_PUBLIC_BACKEND_URL || '').includes(
  'staging',
)
  ? [goerli]
  : [mainnet];

export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    projectId,
    version: 2, // v2 of wallet connect
    chains,
  }),
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
