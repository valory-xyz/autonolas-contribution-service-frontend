import { ethers } from 'ethers';
/**
 *
 * @param {string} balanceInWei
 * @returns formatted balance with appropriate suffix
 */
export const formatWeiBalance = (balanceInWei) => {
  const balanceInEther = ethers.utils.formatEther(balanceInWei);

  const formatNumberWithSuffix = (number) => {
    if (number >= 1e9) {
      return `${Math.floor((number / 1e9) * 10) / 10}B`;
    }
    if (number >= 1e6) {
      return `${(Math.floor((number / 1e6) * 10) / 10)}M`;
    }
    if (number >= 1e3) {
      return `${(Math.floor((number / 1e3) * 10) / 10)}k`;
    }
    return Math.floor(number * 10) / 10;
  };

  return formatNumberWithSuffix(parseFloat(balanceInEther));
};

/**
 *
 * @param {string} balanceInWei
 * @returns formated balance with commas and no digits after decimal point
 */
export const formatWeiBalanceWithCommas = (balanceInWei) => {
  const balanceInEther = ethers.utils.formatEther(balanceInWei);
  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return formatNumberWithCommas(parseInt(balanceInEther, 10));
};

/**
 * Truncates an Ethereum address to show the first startLimit characters,
 * a ..., and the last endLimit characters
 * @param {string} address - The Ethereum address to truncate
 * @returns {string} The truncated address
 */
export const truncateAddress = (address, startLimit = 5, endLimit = 3) => (address
  ? `${address.substring(0, startLimit)}...${address.substring(
    address.length - endLimit,
  )}`
  : '--');
