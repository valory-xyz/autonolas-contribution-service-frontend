import { cookieStorage, createStorage, http } from 'wagmi';
import { mainnet, goerli, base} from 'wagmi/chains';
import { defaultWagmiConfig } from '@web3modal/wagmi';

import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from 'util/constants';
import { RPC_URLS } from 'common-util/Contracts';

// if the PFP_URL contains staging, include goerli
export const SUPPORTED_CHAINS = (
  process.env.NEXT_PUBLIC_PFP_URL || ''
).includes('staging')
  ? [goerli, mainnet, base]
  : [mainnet, base];

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
  transports: SUPPORTED_CHAINS.reduce(
    (acc, chain) => Object.assign(acc, { [chain.id]: http(RPC_URLS[chain.id]) }),
    {},
  ),
});
