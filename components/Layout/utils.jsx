import { getUrl, notifySuccess } from 'common-util/functions';
import { get } from 'lodash';

// LINKED = "linked"
// UNLINKED = "unlinked"
// LINKING = "linking"

const WALLET_STATUS = {
  linked: 'linked',
  unlinked: 'unlinked',
  linking: 'linking',
};

export async function getWalletStatus(address, chainId) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const url = getUrl(chainId);
        const response = await fetch(`${url}/address_status/${address}`);
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
