import React, { useEffect, useState } from 'react';
import { Table } from 'antd/lib';
import dayjs from 'dayjs';
import { getPredictionRequests } from 'common-util/api/predictionRequests';
import { useDispatch, useSelector } from 'react-redux';
import { setPredictionRequests } from 'store/setup/actions';

const columns = [
  {
    title: 'Question',
    dataIndex: 'question',
    key: 'question',
  },
  {
    title: 'Resolution Time',
    dataIndex: 'resolution_time',
    width: 300,
    key: 'resolution_time',
    // eslint-disable-next-line camelcase
    render: (resolution_time) => dayjs.unix(resolution_time).format('HH:mm DD MMM \'YY'),
  }, {
    title: 'State',
    dataIndex: 'state',
    width: 300,
    key: 'state',
    render: (state) => state.charAt(0).toUpperCase() + state.slice(1).toLowerCase(),
  },
];

const PredictionRequestsTable = () => {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const data = useSelector((state) => state?.setup?.predictionRequests);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const predictionRequests = await getPredictionRequests();
        dispatch(setPredictionRequests(predictionRequests));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return <Table dataSource={data} columns={columns} loading={loading} pagination={false} />;
};

export default PredictionRequestsTable;
