import { notification } from 'antd/lib';

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
export const getUrl = (chainId) => (chainId === 1
  ? 'https://contribution-service-backend.autonolas.tech'
  : 'https://contribution-service-backend.staging.autonolas.tech');
