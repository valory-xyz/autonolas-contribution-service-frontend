/* eslint-disable max-len */
// @ts-nocheck // TODO: provide all types
import { ethers } from 'ethers';
import { isNil, lowerCase, toLower } from 'lodash';
import { Address } from 'viem';

import {
  LOCAL_FORK_ID,
  getChainId as getChainIdFn,
  getChainIdOrDefaultToMainnet as getChainIdOrDefaultToMainnetFn,
  getEthersProvider as getEthersProviderFn,
  getIsValidChainId as getIsValidChainIdFn,
  getProvider as getProviderFn,
  sendTransaction as sendTransactionFn,
} from '@autonolas/frontend-library';

import { RPC_URLS } from 'common-util/Contracts';
import data from 'common-util/Education/data.json';
import { SUPPORTED_CHAINS } from 'common-util/Login/config';
import orbis, { checkOrbisStatus } from 'common-util/orbis';
import { XProfile } from 'types/x';

import prohibitedAddresses from '../../data/prohibited-addresses.json';

const getSupportedChains = () =>
  process.env.NEXT_PUBLIC_IS_CONNECTED_TO_LOCAL === 'true'
    ? [...SUPPORTED_CHAINS, { id: LOCAL_FORK_ID }]
    : SUPPORTED_CHAINS;

/**
 * re-usable functions
 */

export const getProvider = () => getProviderFn(getSupportedChains(), RPC_URLS);

export const getEthersProvider = () => getEthersProviderFn(getSupportedChains(), RPC_URLS);

export const getIsValidChainId = (chainId) => getIsValidChainIdFn(getSupportedChains(), chainId);

export const getChainIdOrDefaultToMainnet = (chainId) =>
  getChainIdOrDefaultToMainnetFn(getSupportedChains(), chainId);

export const getChainId = (chainId = null) => {
  if (process.env.NEXT_PUBLIC_IS_CONNECTED_TO_LOCAL === 'true') {
    return LOCAL_FORK_ID;
  }
  return getChainIdFn(getSupportedChains(), chainId);
};

export const sendTransaction = (fn, account) =>
  sendTransactionFn(fn, account, {
    supportedChains: getSupportedChains(),
    rpcUrls: RPC_URLS,
  });

export const isGoerli = (id) => id === 5;

export const getEducationItemByComponent = (component) =>
  data.filter((item) => component === item.component)[0];

export const getTier = (points) => {
  switch (true) {
    case points >= 150000:
      return 'Super Epic';
    case points >= 100000 && points < 150000:
      return 'Epic';
    case points >= 50000 && points < 100000:
      return 'Legendary';
    case points >= 100 && points < 50000:
      return 'Basic';
    default:
      return 'Idle';
  }
};

export const getName = (profile: XProfile | null, address: Address) =>
  profile?.twitter_handle ||
  profile?.discord_handle ||
  profile?.wallet_address ||
  (address && truncateAddress(address)) ||
  'Unknown name';

// TODO: move to autonolas library
/**
 * returns hash from the url
 * @example
 * input: router-path (for example, /components#my-components)
 * output: my-components
 */
export const getHash = (router) => router?.asPath?.split('#')[1] || '';

export const isDevOrStaging =
  process.env.NODE_ENV === 'development' || process.env.NODE_VERCEL_ENV === 'staging';

export const isVercelStaging = process.env.NODE_VERCEL_ENV === 'staging';

/**
 *
 * @param value value to be converted to Eth
 * @param dv Default value to be returned
 * @param fractionDigits Number of digits after the decimal point
 * @returns string with 2 decimal places
 */
export const formatToEth = (
  value: ethers.BigNumberish,
  dv: number = 0,
  fractionDigits: number = 2,
) => {
  if (isNil(value)) return dv || 0;
  return (+ethers.formatEther(value)).toFixed(fractionDigits);
};

/**
 * converts eth to wei
 * @example
 * input: 1
 * output: 1000000000000000000
 */
export const ethersToWei = (value: string) => ethers.parseUnits(value, 'ether');

/**
 * returns error message if user can't add memory message
 * else returns null. If null, enable the button to add memory
 */
export const canAddMemoryMessaage = (list, account) => {
  if (!account) return 'To add to memory, connect wallet';

  const isPresent = list.some((item) => lowerCase(item.address) === lowerCase(account));
  if (!isPresent) return 'To add to memory, join this centaur';

  return null;
};

export const getNumberInMillions = (num) => {
  const formattedNumber = `${new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 3,
  }).format(num / 1000000)}M`;

  return formattedNumber;
};

export const isAddressProhibited = (address) => {
  const addresses = prohibitedAddresses.map((e) => toLower(e));
  return addresses.includes(toLower(address));
};

// Orbis

export const checkOrbisConnection = async () => {
  try {
    const res = await orbis.isConnected();
    return checkOrbisStatus(res?.status);
  } catch (error) {
    console.error('Error checking Orbis connection:', error);
    return false;
  }
};

/**
 * Truncates an Ethereum address to show the first five characters, a ..., and the last three characters
 * @param {string} address - The Ethereum address to truncate
 * @returns {string} The truncated address
 */
export const truncateAddress = (address) =>
  address ? `${address.substring(0, 5)}...${address.substring(address.length - 3)}` : '--';

export const getAddressFromBytes32 = (address) => {
  return '0x' + address.slice(-40);
};

export const getBytes32FromAddress = (address) => {
  return ethers.zeroPadValue(address, 32);
};
