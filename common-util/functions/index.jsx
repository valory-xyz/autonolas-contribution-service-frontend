import { notification } from 'antd/lib';

export const notifyError = (message = 'Some error occured') => notification.error({
  message,
});

export const notifySuccess = (message = 'Successfull', description = null) => notification.success({
  message,
  description,
});

export const isGoerli = (id) => id === 5;
