import get from 'lodash/get';
import { notifySuccess } from 'common-util/functions';

const WALLET_STATUS = {
  linked: 'linked',
  unlinked: 'unlinked',
  linking: 'linking',
};

export async function getWalletStatus(address) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/address_status/${address}`;
        const response = await fetch(url);
        const json = await response.json();
        const walletStatus = get(json, 'status');

        // if linking, poll the status
        if (walletStatus !== WALLET_STATUS.linking) {
          clearInterval(interval);
          if (walletStatus === WALLET_STATUS.linked) {
            notifySuccess('Your wallet is linked');
          }
          resolve(walletStatus === WALLET_STATUS.linked);
        }
      } catch (error) {
        reject(error);
      }
    }, 4000);
  });
}
