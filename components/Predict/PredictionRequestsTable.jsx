import React, { useEffect, useState } from 'react';
import {
  List,
  Typography,
  Spin,
  Progress,
  Card,
  Statistic,
  Button,
} from 'antd';
import dayjs from 'dayjs';
import { getPredictionRequests } from 'common-util/api/predictionRequests';
import { useDispatch, useSelector } from 'react-redux';

import {
  setPredictionRequests,
  setApprovedRequestsCount,
} from 'store/setup/actions';
import { gql } from '@apollo/client';
import { LoadingOutlined, RedoOutlined, LinkOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
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

const PredictionMarketLink = ({ fpmmId }) => (
  <a
    href={`https://aiomen.eth.limo/#/${fpmmId}`}
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
  fpmmId: PropTypes.string.isRequired,
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

    const requestFpmmIds = predictionRequests.map((item) => item.fpmm_id.toLowerCase());

    const queryResponse = await client.query({
      query: GET_FIXED_PRODUCT_MARKET_MAKERS,
      variables: {
        ids: requestFpmmIds,
      },
      fetchPolicy: 'network-only',
    });

    const mergedData = predictionRequests.map((item) => {
      const queryItem = queryResponse.data.fixedProductMarketMakers.find(
        (matchedItem) => matchedItem.id === item.fpmm_id.toLowerCase(),
      );

      const tradeCount = queryResponse.data.fpmmTrades.filter((tradeItem) => {
        const tradeItemId = tradeItem.id;
        return tradeItemId.startsWith(item.fpmm_id.toLowerCase());
      }).length;

      const withoutQueryItem = { ...item, tradeCount };
      const withQueryItem = { ...item, ...queryItem, tradeCount };

      return queryItem ? withQueryItem : withoutQueryItem;
    });

    dispatch(setPredictionRequests(mergedData));
    if (initialLoad) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const intervalId = setInterval(async () => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();

  const DescriptionNoTitle = (
    <Text>
      Creating prediction market... You may need to
      {' '}
      <Button type="ghost" underline onClick={() => router.reload()}>
        <RedoOutlined />
        Refresh
      </Button>
    </Text>
  );

  return (
    <>
      {approvedRequestsCount > 0 && (
        <ProcessingBanner
          message={(
            <>
              <Spin className="mr-12" indicator={spinIcon} />
              {`Processing ${approvedRequestsCount} question${
                approvedRequestsCount > 1 ? 's' : ''
              } – can take up to 10 minutes`}
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
          dataSource={data.sort(
            (a, b) => b.utc_timestamp_processed - a.utc_timestamp_processed,
          )}
          loading={loading}
          renderItem={(item) => {
            const {
              outcomeTokenMarginalPrices,
              resolution_time: resolutionTime,
              currentAnswer,
              tradeCount,
              answerFinalizedTimestamp,
              fpmm_id: fpmmId,
              title,
            } = item;

            const getMarginalPricePercent = (index) => {
              const marginalPrice = outcomeTokenMarginalPrices?.[index] ?? 0;
              return Math.round(parseFloat(marginalPrice) * 100);
            };

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
                {`Final answer will be available on ${dayjs
                  .unix(resolutionTime)
                  .format(answerDateFormat)} ·`}
                {' '}
                <PredictionMarketLink fpmmId={fpmmId} />
              </Text>
            );

            const ListItemDescription = () => (
              <>
                <Text strong>{` Answer – ${answerStatus}`}</Text>
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
                        value={getMarginalPricePercent(0)}
                        valueStyle={{ color: '#34d399' }}
                        suffix="%"
                      />
                      <Statistic
                        title="No"
                        value={getMarginalPricePercent(1)}
                        valueStyle={{ color: '#f43f5e' }}
                        suffix="%"
                      />
                      <Statistic title="Prediction Count" value={tradeCount} />
                    </div>
                    <Progress
                      percent={getMarginalPricePercent(0)}
                      strokeColor="#34d399"
                      trailColor="#f43f5e"
                      strokeLinecap="butt"
                      showInfo={false}
                      style={{ maxWidth: '600px' }}
                    />
                    <br />
                    <FinalAnswerText />
                  </>
                )}
                {answerStatus === STATUS.FINALIZING && <FinalAnswerText />}
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
                        .format(answerDateFormat)} ·`}
                      {' '}
                      <PredictionMarketLink fpmmId={fpmmId} />
                    </Text>
                  </>
                )}
              </>
            );

            return (
              <List.Item style={{ padding: '20px' }}>
                <List.Item.Meta
                  title={
                    title ? (
                      <div style={{ maxWidth: '600px' }} className="mb-12">
                        <Text
                          style={{ fontSize: '24px', wordWrap: 'break-word' }}
                        >
                          {item.title}
                        </Text>
                      </div>
                    ) : null
                  }
                  description={
                    title ? <ListItemDescription /> : <DescriptionNoTitle />
                  }
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
