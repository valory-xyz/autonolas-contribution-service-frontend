import { ethers } from 'ethers';
import { notification } from 'antd/lib';
import { COLOR } from 'util/theme';

export const getBalance = (account, p) => new Promise((resolve, reject) => {
  p.eth
    .getBalance(account)
    .then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance);
      resolve(balanceInEth);
    })
    .catch((e) => {
      reject(e);
    });
});

/**
 *
 * @param {BigNumebr} value value to be converted to Eth
 * @param {Number} dv Default value to be returned
 * @returns
 */
export const formatToEth = (value, dv = 0) => (+ethers.utils.formatEther(value)).toFixed(4) || dv;

export const notifyError = (message = 'Some error occured') => notification.error({
  message,
});

export const notifySuccess = (message = 'Successfull', description = null) => notification.success({
  message,
  description,
});

const getChainId = async () => {
  const id = await window.WEB3_PROVIDER.eth.getChainId();
  return id;
};

export const isGoerli = async () => {
  const id = await getChainId();
  return id === 5;
};
