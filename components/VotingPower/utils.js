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
      return `${(number / 1e9).toFixed(1)}B`;
    }
    if (number >= 1e6) {
      return `${(number / 1e6).toFixed(1)}M`;
    }
    if (number >= 1e3) {
      return `${(number / 1e3).toFixed(1)}k`;
    }
    return number.toFixed(1);
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
