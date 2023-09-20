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
      const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/address_status/${account}`;

      axios.get(URL).then((response) => {
        const walletStatus = response?.data?.status;

        // if `linking`, poll until linked or unlinked else resolve
        if (walletStatus !== WALLET_STATUS.linking) {
          resolve(walletStatus === WALLET_STATUS.linked);
        } else {
          pollStatus(URL).then((pollResponse) => {
            resolve(pollResponse);
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

const getHealthcheckData = async () => {
  const URL = `${process.env.NEXT_PUBLIC_PFP_URL}/healthcheck`;
  const response = await axios.get(URL);
  return response?.data;
};

/**
 * polling healthcheck every 2 seconds when is_transitioning_fast is false
 * ie. Backend is disrupted
 */
const pollHealthCheckup = async (timeoutInSeconds) => new Promise((resolve, reject) => {
  const interval = setInterval(async () => {
    try {
      const data = await getHealthcheckData();
      const isHealthy = !!data?.is_transitioning_fast;

      if (isHealthy) {
        clearInterval(interval);
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  }, timeoutInSeconds);
});

export const getHealthcheck = async () => {
  const data = await getHealthcheckData();
  const isHealthy = !!data?.is_transitioning_fast;

  if (isHealthy) {
    return data;
  }

  window.console.warn(
    `Healthcheck: is_transitioning_fast is ${data?.is_transitioning_fast?.toString()}, polling healthcheck`,
  );

  const responseFromPolling = await pollHealthCheckup(2000);
  return responseFromPolling;
};
