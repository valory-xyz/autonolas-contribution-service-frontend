import { useState, useEffect } from 'react';

const POLLING_TYPE = {
  STANDARD: 'standard',
  DISRUPTED: 'disrupted',
};

const fetchUrl = (URL) => fetch(URL).then((response) => response.json());

export const useHealthCheckup = (
  apiEndpoint,
  pollingInterval,
  pollingCallback,
) => {
  const [isServiceHealthy, setIsServiceHealthy] = useState(false);

  // polling type will be decided based on the health of the service
  const [pollingType, setPollingType] = useState(null);

  // function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetchUrl(apiEndpoint);
      const isHealthy = !!response.is_transitioning_fast;

      setIsServiceHealthy(isHealthy);
      setPollingType(
        isHealthy ? POLLING_TYPE.STANDARD : POLLING_TYPE.DISRUPTED,
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Trigger polling at the specified interval
  useEffect(() => {
    const interval = setInterval(
      async () => {
        await fetchData();

        if (isServiceHealthy && typeof pollingCallback === 'function') {
          pollingCallback();
        }
      },

      // if service is NOT healthy, poll every 3 seconds to check if service is back up,
      // else if service is healthy, poll at the specified interval
      isServiceHealthy ? pollingInterval : 3000,
    );

    return () => clearInterval(interval);
  }, [isServiceHealthy, pollingType]);

  // Initial fetch of data (1st render)
  useEffect(() => {
    fetchData();
  }, []);

  return [isServiceHealthy];
};
