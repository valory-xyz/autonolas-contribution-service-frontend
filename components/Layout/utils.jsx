import axios from 'axios';

const WALLET_STATUS = {
  linked: 'linked',
  unlinked: 'unlinked',
  linking: 'linking',
};

const pollStatus = async (url) => new Promise((resolve, reject) => {
  const interval = setInterval(async () => {
    try {
      const response = await axios.get(url);
      const walletStatus = response?.data?.status;

      // if linking, poll the status
      if (walletStatus !== WALLET_STATUS.linking) {
        clearInterval(interval);
        resolve(walletStatus === WALLET_STATUS.linked);
      }
    } catch (error) {
      reject(error);
    }
  }, 4000);
});

export async function getAddressStatus(account) {
  return new Promise((resolve, reject) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/address_status/${account}`;

      axios.get(url).then((response) => {
        const walletStatus = response?.data?.status;

        // if `linking`, poll until linked or unlinked else resolve
        if (walletStatus !== WALLET_STATUS.linking) {
          resolve(walletStatus === WALLET_STATUS.linked);
        } else {
          pollStatus(url).then((pollResponse) => {
            resolve(pollResponse);
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * healthcheck
 */
const pollHealthCheckup = async (urlPassed) => new Promise((resolve, reject) => {
  const interval = setInterval(async () => {
    try {
      const response = await axios.get(urlPassed);

      // if healthcheck is returned false or positive seconds, stop polling
      const canStopPoll = response?.data?.healthcheck === false
          || response?.data?.seconds_until_next_update > 1;

      if (canStopPoll) {
        clearInterval(interval);
        resolve(response.data);
      }
    } catch (error) {
      reject(error);
    }
  }, 2000);
});

export const getHealthcheck = async () => new Promise((resolve, reject) => {
  const url = `${process.env.NEXT_PUBLIC_PFP_URL}/healthcheck`;

  axios
    .get(url)
    .then((response) => {
      // if we received negative value, poll health checkup
      if (response?.data?.seconds_until_next_update < 0) {
        pollHealthCheckup(url)
          .then((responseFromPolling) => resolve(responseFromPolling))
          .catch((e) => reject(e));
      } else {
        resolve(response?.data);
      }
    })
    .catch((error) => {
      reject(error);
    });
});
