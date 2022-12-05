import { getMintContract } from 'common-util/Contracts';
import { formatToEth } from 'common-util/functions';

export const fetchMapLockedBalances = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getMintContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .mapLockedBalances(account)
    .call()
    .then((response) => {
      // multiplied by 1000 to convert to milliseconds
      resolve({
        amount: formatToEth(response.totalAmount),
        startTime: response.startTime * 1000,
        endTime: response.endTime * 1000,
        transferredAmount: response.transferredAmount,
      });
    })
    .catch((e) => {
      window.console.log('Error occured on fetching MapLockedBalances:');
      reject(e);
    });
});

export const fetchReleasableAmount = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getMintContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .releasableAmount(account)
    .call()
    .then((response) => {
      resolve(formatToEth(response));
    })
    .catch((e) => {
      window.console.log('Error occured on fetching ReleasableAmount:');
      reject(e);
    });
});

// Create lock
export const withdraw = ({
  account, chainId,
}) => new Promise((resolve, reject) => {
  const contract = getMintContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .withdraw()
    .send({ from: account })
    .once('transactionHash', (hash) => resolve(hash))
    .then((response) => resolve(response?.transactionHash))
    .catch((e) => {
      window.console.log('Error occured on creating lock:');
      reject(e);
    });
});
