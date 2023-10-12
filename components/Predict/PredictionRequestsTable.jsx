import React, { useEffect, useState } from 'react';
import {
  List, Typography, Spin, Progress, Card, Statistic,
} from 'antd/lib';
import dayjs from 'dayjs';
import { getPredictionRequests } from 'common-util/api/predictionRequests';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPredictionRequests,
  setApprovedRequestsCount,
} from 'store/setup/actions';
import { gql } from '@apollo/client';
import { LoadingOutlined, LinkOutlined } from '@ant-design/icons';
import client from '../../apolloClient';
import { ProcessingBanner } from './styles';

const { Text } = Typography;

const GET_FIXED_PRODUCT_MARKET_MAKERS = gql`
  query GetFixedProductMarketMakers($ids: [ID!]!) {
    fixedProductMarketMakers(
      orderBy: creationTimestamp
      where: { id_in: $ids }
      orderDirection: desc
      first: 1000
    ) {
      title
      id
      outcomeTokenMarginalPrices
      outcomes
      creationTimestamp
      answerFinalizedTimestamp
      outcomeTokenMarginalPrices
      currentAnswer
      resolutionTimestamp
    }
    fpmmTrades(where: { fpmm_in: $ids }) {
      id
      outcomeTokensTraded
    }
  }
`;

const spinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const PredictionRequestsTable = () => {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const { predictionRequests: data, approvedRequestsCount } = useSelector(
    (state) => state?.setup,
  );

  const fetchData = async (initialLoad = false) => {
    if (initialLoad) {
      setLoading(true);
    }
    const {
      processedRequests: predictionRequests,
      approvedRequestsCount: count,
    } = await getPredictionRequests();
    dispatch(setApprovedRequestsCount(count));

    const queryResponse = await client.query({
      query: GET_FIXED_PRODUCT_MARKET_MAKERS,
      variables: { ids: predictionRequests.map((item) => item.id) },
    });

    const mergedData = predictionRequests.map((item) => {
      const queryItem = queryResponse.data.fixedProductMarketMakers.find(
        (matchedItem) => matchedItem.id === item.id,
      );
      const tradeCount = queryResponse.data.fpmmTrades.filter(
        (tradeItem) => tradeItem.id.startsWith(item.id),
      ).length;

      return queryItem
        ? { ...item, ...queryItem, tradeCount }
        : { ...item, tradeCount };
    });

    dispatch(setPredictionRequests(mergedData));
    if (initialLoad) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const intervalId = setInterval(async () => {
      const { approvedRequestsCount: newCount } = await getPredictionRequests();

      if (newCount !== approvedRequestsCount) {
        fetchData();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [approvedRequestsCount]);

  return (
    <>
      {approvedRequestsCount > 0 && (
        <ProcessingBanner
          message={(
            <>
              <Spin className="mr-12" indicator={spinIcon} />
              {`Processing ${approvedRequestsCount} question${
                approvedRequestsCount > 1 ? 's' : ''
              }`}
            </>
          )}
          showIcon={false}
          banner
          className="mb-12"
        />
      )}

      <Card
        bodyStyle={{
          padding: 0,
          backgroundColor: 'white',
          borderRadius: '5px',
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={data}
          loading={loading}
          renderItem={(item) => {
            let answerStatus;
            if (item.currentAnswer) {
              answerStatus = 'Final';
            } else if (item.outcomeTokenMarginalPrices) {
              answerStatus = 'Predicted';
            } else {
              answerStatus = 'Finalizing...';
            }

            return (
              <List.Item style={{ padding: '20px' }}>
                <List.Item.Meta
                  title={(
                    <div style={{ maxWidth: '600px' }} className="mb-12">
                      <Text
                        style={{
                          fontSize: '24px',
                          wordWrap: 'break-word',
                        }}
                      >
                        {item.title}
                      </Text>
                    </div>
                  )}
                  description={(
                    <>
                      <Text strong>
                        Answer –
                        {answerStatus}
                      </Text>
                      <br />
                      {answerStatus === 'Predicted' && (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              gap: '2rem',
                            }}
                          >
                            <Statistic
                              title="Yes"
                              value={Math.round(
                                parseFloat(
                                  item?.outcomeTokenMarginalPrices
                                    && item.outcomeTokenMarginalPrices[0],
                                ) * 100,
                              )}
                              valueStyle={{ color: '#10b981' }}
                              suffix="%"
                            />
                            <Statistic
                              title="No"
                              value={Math.round(
                                (1
                                  - parseFloat(
                                    item.outcomeTokenMarginalPrices
                                      && item.outcomeTokenMarginalPrices[0],
                                  ))
                                  * 100,
                              )}
                              valueStyle={{ color: '#ef4444' }}
                              suffix="%"
                            />
                            <Statistic
                              title="Prediction Count"
                              value={item.tradeCount}
                            />
                          </div>
                          <Progress
                            percent={
                              parseFloat(
                                item.outcomeTokenMarginalPrices
                                  && item.outcomeTokenMarginalPrices[0],
                              ) * 100
                            }
                            strokeColor="#10b981"
                            trailColor="#ef4444"
                            strokeLinecap="butt"
                            showInfo={false}
                            style={{ maxWidth: '600px' }}
                          />
                          <br />
                          <Text type="secondary">
                            Final answer will be available on
                            {' '}
                            {dayjs
                              .unix(item.resolution_time)
                              .format("DD MMM 'YY")}
                            {' '}
                            ·
                            {' '}
                            <a
                              href={`https://aiomen.eth.limo/#/${item.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                            >
                              See prediction market
                              {' '}
                              <LinkOutlined
                                style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                              />
                            </a>
                          </Text>
                        </>
                      )}
                      {answerStatus === 'Finalizing...' && (
                        <Text type="secondary">
                          Final answer will be available on
                          {' '}
                          {dayjs
                            .unix(item.resolution_time)
                            .format("DD MMM 'YY")}
                          {' '}
                          ·
                          {' '}
                          <a
                            href={`https://aiomen.eth.limo/#/${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                          >
                            See prediction market
                            {' '}
                            <LinkOutlined
                              style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                            />
                          </a>
                        </Text>
                      )}
                      {answerStatus === 'Final' && (
                        <>
                          <Statistic
                            value={
                              // eslint-disable-next-line radix
                              parseInt(item.currentAnswer?.slice(-1)) === 1
                                ? 'Yes'
                                : 'No'
                            }
                          />
                          <Text type="secondary">
                            {`Answered on ${dayjs
                              .unix(item.answerFinalizedTimestamp)
                              .format("DD MMM 'YY")}`}
                            {' '}
                            ·
                            {' '}
                            <a
                              href={`https://aiomen.eth.limo/#/${item.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                            >
                              See prediction market
                              {' '}
                              <LinkOutlined
                                style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                              />
                            </a>
                          </Text>
                        </>
                      )}
                    </>
                  )}
                />
              </List.Item>
            );
          }}
        />
      </Card>
    </>
  );
};

export default PredictionRequestsTable;
