import { defaultWagmiConfig } from '@web3modal/wagmi';
import { cookieStorage, createStorage, http } from 'wagmi';
import { Chain, base, goerli, mainnet } from 'wagmi/chains';

import { RPC_URLS } from 'common-util/Contracts';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from 'util/constants';

// if the PFP_URL contains staging, include goerli
export const SUPPORTED_CHAINS: [Chain, ...Chain[]] = (
  process.env.NEXT_PUBLIC_PFP_URL || ''
).includes('staging')
  ? [goerli, mainnet, base]
  : [mainnet, base];

export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID as string;

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
  transports: SUPPORTED_CHAINS.reduce(
    (acc, chain) =>
      Object.assign(acc, { [chain.id]: http(RPC_URLS[chain.id as keyof typeof RPC_URLS]) }),
    {},
  ),
});
