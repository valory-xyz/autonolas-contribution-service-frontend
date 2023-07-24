import { notification } from 'antd/lib';
import data from '../../components/Home/MintNft/Education/data.json';

export const notifyError = (message = 'Some error occured') => notification.error({
  message,
});

export const notifySuccess = (message = 'Successfull', description = null) => notification.success({
  message,
  description,
});

export const isGoerli = (id) => id === 5;

export const getEducationItemByComponent = (slug) => data.filter((item) => slug === item.slug)[0];

export const getTier = (points) => {
  switch (true) {
    case points >= 150000:
      return 'Super Epic';
    case (points >= 100000 && points < 150000):
      return 'Epic';
    case (points >= 50000 && points < 100000):
      return 'Legendary';
    case (points >= 100 && points < 50000):
      return 'Basic';
    default:
      return 'Idle';
  }
};

export const getName = (profile) => profile.twitter_handle
|| profile.discord_handle
|| profile.wallet_address
|| 'Unknown name';
