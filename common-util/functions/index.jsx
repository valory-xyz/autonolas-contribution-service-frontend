import { notification } from 'antd/lib';
import data from '../../components/Education/data.json';

export const notifyError = (message = 'Some error occured') => notification.error({
  message,
});

export const notifySuccess = (message = 'Successfull', description = null) => notification.success({
  message,
  description,
});

export const isGoerli = (id) => id === 5;

export const getEducationItemByComponent = (slug) => data.filter((item) => slug === item.slug)[0];
