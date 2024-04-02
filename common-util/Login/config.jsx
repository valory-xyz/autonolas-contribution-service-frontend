import { cookieStorage, createStorage } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import { defaultWagmiConfig } from '@web3modal/wagmi';

import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from 'util/constants';

// if the PFP_URL contains staging, use goerli, else use mainnet
export const SUPPORTED_CHAINS = (
  process.env.NEXT_PUBLIC_PFP_URL || ''
).includes('staging')
  ? [goerli, mainnet]
  : [mainnet];

export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

const metadata = {
  name: SITE_TITLE,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

/**
 * @type {import('@web3modal/wagmi').WagmiOptions}
 */
export const wagmiConfig = defaultWagmiConfig({
  chains: SUPPORTED_CHAINS,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
});
