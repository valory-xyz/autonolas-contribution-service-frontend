import { ethers } from 'ethers';
import { toLower, isNil } from 'lodash';
import { notification } from 'antd/lib';
import data from 'common-util/Education/data.json';

export const notifyError = (message = 'Some error occured') => notification.error({
  message,
});

export const notifySuccess = (message = 'Successfull', description = null) => notification.success({
  message,
  description,
});

export const isGoerli = (id) => id === 5;

export const getEducationItemByComponent = (slug) => data.filter((item) => slug === item.slug)[0];

export const areAddressesEqual = (a1, a2) => toLower(a1) === toLower(a2);

export const getTier = (points) => {
  switch (true) {
    case points >= 150000:
      return 'Super Epic';
    case (points >= 100000 && points < 150000):
      return 'Epic';
    case (points >= 50000 && points < 100000):
      return 'Legendary';
    case (points >= 100 && points < 50000):
      return 'Basic';
    default:
      return 'Idle';
  }
};

export const getName = (profile) => profile.twitter_handle
|| profile.discord_handle
|| profile.wallet_address
|| 'Unknown name';

// TODO: move to autonolas library
/**
 * returns hash from the url
 * @example
 * input: router-path (for example, /components#my-components)
 * output: my-components
 */
export const getHash = (router) => router?.asPath?.split('#')[1] || '';

export const isDevOrStaging = process.env.NODE_ENV === 'development'
  || process.env.NODE_VERCEL_ENV === 'staging';

/**
 *
 * @param {BigNumebr} value value to be converted to Eth
 * @param {Number} dv Default value to be returned
 * @returns {String} with 2 decimal places
 */
export const formatToEth = (value, dv = 0) => {
  if (isNil(value)) return dv || 0;
  return (+ethers.utils.formatEther(value)).toFixed(2);
};
