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
