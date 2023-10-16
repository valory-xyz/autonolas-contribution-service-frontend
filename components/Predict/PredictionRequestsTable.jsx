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
import PropTypes from 'prop-types';
import { COLOR } from '@autonolas/frontend-library';
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

const PredictionMarketLink = ({ id }) => (
  <a
    href={`https://aiomen.eth.limo/#/${id}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: 'rgba(0, 0, 0, 0.45)' }}
  >
    See prediction market
    {' '}
    <LinkOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
  </a>
);

PredictionMarketLink.propTypes = {
  id: PropTypes.string.isRequired,
};

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
            const {
              id,
              outcomeTokenMarginalPrices,
              resolution_time: resolutionTime,
              currentAnswer,
              tradeCount,
              answerFinalizedTimestamp,
            } = item;

            if (!id) {
              return null;
            }

            const marginalPrice = outcomeTokenMarginalPrices?.[0] ?? 0;
            const marginalPriceAsPercent = parseFloat(marginalPrice) * 100;

            const STATUS = {
              PREDICTED: 'Predicted',
              FINAL: 'Final',
              FINALIZING: 'Finalizing...',
            };

            let answerStatus;
            if (currentAnswer) {
              answerStatus = STATUS.FINAL;
            } else if (outcomeTokenMarginalPrices) {
              answerStatus = STATUS.PREDICTED;
            } else {
              answerStatus = STATUS.FINALIZING;
            }

            const answerDateFormat = "DD MMM 'YY";
            const FinalAnswerText = () => (
              <Text type="secondary">
                Final answer will be available on
                {' '}
                {dayjs.unix(resolutionTime).format(answerDateFormat)}
                {' '}
                ·
                {' '}
                <PredictionMarketLink id={id} />
              </Text>
            );

            const ListItemDescription = () => (
              <>
                <Text strong>
                  Answer –
                  {' '}
                  {answerStatus}
                </Text>
                <br />
                {answerStatus === STATUS.PREDICTED && (
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
                          marginalPriceAsPercent,
                        )}
                        valueStyle={{ color: COLOR.GREEN_1 }}
                        suffix="%"
                      />
                      <Statistic
                        title="No"
                        value={Math.round(
                          marginalPriceAsPercent,
                        )}
                        valueStyle={{ color: COLOR.RED }}
                        suffix="%"
                      />
                      <Statistic
                        title="Prediction Count"
                        value={tradeCount}
                      />
                    </div>
                    <Progress
                      percent={
                        marginalPriceAsPercent
                      }
                      strokeColor={COLOR.GREEN_1}
                      trailColor={COLOR.RED}
                      strokeLinecap="butt"
                      showInfo={false}
                      style={{ maxWidth: '600px' }}
                    />
                    <br />
                    <FinalAnswerText />
                  </>
                )}
                {answerStatus === STATUS.FINALIZING && (
                  <FinalAnswerText />
                )}
                {answerStatus === STATUS.FINAL && (
                  <>
                    <Statistic
                      value={
                        parseInt(currentAnswer?.slice(-1), 10) === 0
                          ? 'Yes'
                          : 'No'
                      }
                    />
                    <Text type="secondary">
                      {`Answered on ${dayjs
                        .unix(answerFinalizedTimestamp)
                        .format(answerDateFormat)}`}
                      {' '}
                      ·
                      {' '}
                      <PredictionMarketLink id={id} />
                    </Text>
                  </>
                )}
              </>
            );

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
                  description={<ListItemDescription />}
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
