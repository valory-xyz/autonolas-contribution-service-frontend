import { Address } from 'viem';

export const GATEWAY_URL = 'https://gateway.autonolas.tech/ipfs/';

export const SITE_URL = 'https://contribute.olas.network';
export const SITE_TITLE = 'Olas Contribute';
export const SITE_DESCRIPTION =
  'Contribute to the Olas DAO by completing actions, earning points, climbing the rankings and upgrading your badge';
export const SITE_META_TAG_IMAGE = `${SITE_URL}/images/site-metadata/site-metatag.jpg`;

export const META_TAGS_INFO = {
  siteUrl: SITE_URL,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  image: SITE_META_TAG_IMAGE,
};

export const MENU_WIDTH = 248;

export const DEFAULT_COORDINATE_ID = '2';

export const MAX_TWEET_LENGTH = 280;
export const MAX_TWEET_IMAGES = 4;

export const PREDICT_BASE_URL = process.env.NEXT_PUBLIC_PREDICT_BASE_URL;
export const PREDICT_PROPOSE_ENDPOINT = '/propose_market';
export const PREDICT_APPROVE_ENDPOINT = '/approve_market';
export const PREDICT_GET_ALL_ENDPOINT = '/all_markets';

export const ONE_MILLION = 1000000;
export const VEOLAS_QUORUM = ONE_MILLION * 2;
export const ONE_IN_WEI = '1000000000000000000';
export const HUNDRED_K_OLAS_IN_WEI = '100000000000000000000000';

export const VEOLAS_URL = 'https://govern.olas.network/veolas';
export const GOVERN_APP_URL = 'https://govern.olas.network';
export const OPERATE_APP_URL = 'https://operate.olas.network';

export const STAKING_CONTRACTS_DETAILS: Record<
  string,
  { name: string; totalBond: number; pointsPerEpoch: number; isDeprecated?: boolean }
> = {
  '0x95146adf659f455f300d7521b3b62a3b6c4aba1f': {
    name: 'Contribute Alpha',
    totalBond: 100,
    pointsPerEpoch: 200,
    isDeprecated: true,
  },
  '0x2c8a5ac7b431ce04a037747519ba475884bce2fb': {
    name: 'Contribute Alpha 2',
    totalBond: 100,
    pointsPerEpoch: 200,
    isDeprecated: true,
  },
  '0x708e511d5fcb3bd5a5d42f42aa9a69ec5b0ee2e8': {
    name: 'Contribute Alpha 3',
    totalBond: 500,
    pointsPerEpoch: 1000,
    isDeprecated: true,
  },
  '0xe2e68ddafbdc0ae48e39cdd1e778298e9d865cf4': {
    name: 'Contribute Beta I',
    totalBond: 100,
    pointsPerEpoch: 200,
  },
  '0x6ce93e724606c365fc882d4d6dfb4a0a35fe2387': {
    name: 'Contribute Beta II',
    totalBond: 300,
    pointsPerEpoch: 600,
  },
  '0x28877ffc6583170a4c9ed0121fc3195d06fd3a26': {
    name: 'Contribute Beta III',
    totalBond: 500,
    pointsPerEpoch: 1000,
  },
};

export const DEPRECATED_CONTRACTS_ADDRESSES = Object.entries(STAKING_CONTRACTS_DETAILS).reduce<
  string[]
>((acc, [address, item]) => {
  if (item.isDeprecated) acc.push(address);
  return acc;
}, []);

export const STAKING_CONTRACTS_BASE_SUBGRAPH_URL =
  'https://api.studio.thegraph.com/query/67875/olas-base-staking-rewards-history/version/latest';
export const OLAS_UNICODE_SYMBOL = '☴';
export const SERVICE_STAKING_STATE = ['Unstaked', 'Staked', 'Evicted'];
