/* eslint-disable jest/require-hook */
/* eslint-disable no-console */
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { configureChains, createConfig } from 'wagmi';
import {
  // mainnet,
  goerli,
} from 'wagmi/chains';
import { SafeConnector } from 'wagmi/connectors/safe';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import { RPC_URLS } from 'common-util/Contracts';

// export const SUPPORTED_CHAINS = (
//   process.env.NEXT_PUBLIC_BACKEND_URL || 'staging'
// ).includes('staging')
//   ? [goerli]
//   : [mainnet];

export const SUPPORTED_CHAINS = [goerli];

console.log('LOGGING ENVIRONMENT VARIABLES');
console.log(process.env);

export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

const { publicClient, webSocketPublicClient, chains } = configureChains(
  SUPPORTED_CHAINS,
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: RPC_URLS[chain.id],
      }),
    }),
    w3mProvider({ projectId }),
  ],
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  logger: { warn: null },
  connectors: [
    ...w3mConnectors({
      projectId,
      version: 2, // v2 of wallet connect
      chains,
    }),
    new SafeConnector({
      chains,
      options: {
        allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
        debug: false,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
