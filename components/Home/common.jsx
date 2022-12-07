import { ethers } from 'ethers';
import moment from 'moment';
import { Form, InputNumber, DatePicker } from 'antd/lib';
import isNil from 'lodash/isNil';
import { Shimmer } from 'common-util/Shimmer';

const fullWidth = { width: '100%' };

export const getToken = ({ tokenName, token, isLoading = false }) => (
  <div className={`section ${tokenName}-section`}>
    <div className="info">
      <span className="token-name">{tokenName}</span>
      <span className="balance">
        <>{isLoading ? <Shimmer /> : <>{token || '--'}</>}</>
      </span>
    </div>
  </div>
);

// multiply by 10^18
export const parseAmount = (amount) => ethers.utils.parseUnits(`${amount}`, 18).toString();

// - convert to milliseconds
// - divide by 100 to convert to seconds
// - remove decimals
export const parseToSeconds = (unlockTime) => {
  const futureDateInTimeStamp = Math.round(
    new Date(unlockTime).getTime() / 1000,
  );
  const todayDateInTimeStamp = Math.round(new Date().getTime() / 1000);
  return futureDateInTimeStamp - todayDateInTimeStamp;
};

// Cannot select days before today and today
export const disableDateForUnlockTime = (current) => {
  const pastDate = current < moment().endOf('day');

  // cannot select date more than 4 years
  const futureDate = current > moment().add(4, 'years');
  return (current && pastDate) || futureDate;
};

export const FormItemInputNumber = () => (
  <Form.Item
    name="amount"
    label="Amount"
    rules={[
      { required: true, message: 'Amount is required' },
      () => ({
        validator(_, value) {
          if (value === '' || isNil(value)) return Promise.resolve();
          return value <= 1
            ? Promise.reject(new Error('Please input a valid amount'))
            : Promise.resolve();
        },
      }),
    ]}
  >
    <InputNumber style={fullWidth} />
  </Form.Item>
);

export const FormItemDate = () => (
  <Form.Item
    name="unlockTime"
    label="Unlock Time"
    rules={[{ required: true, message: 'Unlock Time is required' }]}
  >
    <DatePicker
      disabledDate={disableDateForUnlockTime}
      showTime={{ format: 'HH:mm' }}
      format="MM/DD/YYYY HH:mm"
      style={fullWidth}
    />
  </Form.Item>
);
