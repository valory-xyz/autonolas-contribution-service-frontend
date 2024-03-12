'use client';

import { WagmiConfig } from 'wagmi';
// import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
// import { SafeConnector } from 'wagmi/connectors/safe';
// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { useEffect } from 'react';

// import { arbitrum, mainnet } from 'viem/chains'

// import { RPC_URLS } from 'common-util/Contracts';

// if the PFP_URL contains staging, use goerli, else use mainnet
export const SUPPORTED_CHAINS = (
  process.env.NEXT_PUBLIC_PFP_URL || ''
).includes('staging')
  ? [goerli]
  : [mainnet];

export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

// const { publicClient, webSocketPublicClient, chains } = configureChains(
//   SUPPORTED_CHAINS,
//   [
//     jsonRpcProvider({
//       rpc: (chain) => ({
//         http: RPC_URLS[chain.id],
//       }),
//     }),
//     w3mProvider({ projectId }),
//   ],
// );

// export const wagmiConfig = createConfig({
//   autoConnect: true,
//   logger: { warn: null },
//   connectors: [
//     ...w3mConnectors({
//       projectId,
//       version: 2, // v2 of wallet connect
//       chains,
//     }),
//     new SafeConnector({
//       chains,
//       options: {
//         allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
//         debug: false,
//       },
//     }),
//   ],
//   publicClient,
//   webSocketPublicClient,
// });

// export const ethereumClient = new EthereumClient(wagmiConfig, chains);

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// const chains = [mainnet, arbitrum];
export const wagmiConfig = defaultWagmiConfig({ chains: [mainnet], projectId, metadata });
console.log('====================================');
console.log('wagmiConfig', wagmiConfig);

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains: [mainnet],
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  metadata,
});
// 3. Create modal
// eslint-disable-next-line jest/require-hook

export const Web3Modal = ({ children }) => {
  console.log('wagmiConfig');
  // useEffect(() => {
  //   createWeb3Modal({
  //     wagmiConfig,
  //     projectId,
  //     chains: [mainnet],
  //     enableAnalytics: true, // Optional - defaults to your Cloud configuration
  //     metadata,
  //   });
  // }, []);
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};
