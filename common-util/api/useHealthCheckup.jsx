import { notifyError } from 'common-util/functions';
import { useEffect, useState } from 'react';

/**
 *
 * @param {string} apiEndpoint
 * @param {number} pollingInterval
 * @param {function} pollingCallback
 * @returns {Object} data
 */
export const useApiPolling = (
  apiEndpoint,
  pollingInterval = 60 * 1000,
  pollingCallback,
) => {
  const [data, setData] = useState(null);

  // function to fetch data from the API
  const fetchData = async () => {
    try {
      const responses = await fetch(apiEndpoint);
      const jsonData = await responses.json();
      setData(jsonData);
    } catch (error) {
      notifyError('Error fetching health checkup');
      console.error(error);
    }
  };

  // Trigger polling at the specified interval
  useEffect(() => {
    fetchData(); // Initial fetch of data (1st render)

    const pollingTimer = setInterval(async () => {
      await fetchData(); // Fetch data at the specified interval

      if (typeof pollingCallback === 'function') {
        pollingCallback();
      }
    }, pollingInterval);

    // Cleanup the polling interval when the component unmounts
    return () => clearInterval(pollingTimer);
  }, [pollingInterval]);

  const isHealthy = !!data?.is_transitioning_fast;

  return { isHealthy, data };
};
