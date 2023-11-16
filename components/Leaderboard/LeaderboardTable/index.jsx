/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Table, Card } from 'antd';
import Link from 'next/link';
import { COLOR, NA } from '@autonolas/frontend-library';

import { setLeaderboard } from 'store/setup/actions';
import { getLeaderboardList } from 'common-util/api';
import { getName, getTier } from 'common-util/functions';
import { EducationTitle } from '../MintNft/Education';
import { LeaderboardContent } from './styles';

const { Text } = Typography;

const Leaderboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const chainId = useSelector((state) => state?.setup?.chainId);
  const data = useSelector((state) => state?.setup?.leaderboard);
  const dispatch = useDispatch();

  const columns = [
    { title: 'Rank', dataIndex: 'rank', width: 50 },
    {
      title: 'Name',
      width: 250,
      render: (record) => (
        <Link href={`/profile/${record.wallet_address}`}>
          {getName(record)}
        </Link>
      ) || '--',
    },
    {
      title: 'Socials',
      render: (record) => {
        const {
          wallet_address, twitter_handle, discord_id, rowKeyUi,
        } = record;

        const socials = [
          wallet_address && (
            <span className="mr-12">
              <a
                href={`https://etherscan.io/address/${wallet_address}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wallet address"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 320 512"
                >
                  <path
                    fill={COLOR.GREY_2}
                    d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"
                  />
                </svg>
              </a>
            </span>
          ),
          twitter_handle && (
            <span className="mr-12">
              <a
                href={`https://twitter.com/${twitter_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter handle"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill={COLOR.GREY_2}
                    d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                  />
                </svg>
              </a>
            </span>
          ),
          discord_id && (
            <a
              href={`https://discord.com/users/${discord_id}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord ID"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 640 512"
              >
                <path
                  fill={COLOR.GREY_2}
                  d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"
                />
              </svg>
            </a>
          ),
        ].filter(Boolean);

        if (socials.length === 0) return NA;

        return socials.map((social, index) => (
          <Text type="secondary" key={`${rowKeyUi}-social-${index}`}>
            {social}
            {' '}
          </Text>
        ));
      },
    },
    {
      title: 'Points',
      dataIndex: 'points',
    },
    {
      title: 'Tier',
      dataIndex: 'points',
      render: (points) => getTier(points),
      responsive: ['md'],
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    const fn = async () => {
      try {
        const response = await getLeaderboardList();
        dispatch(setLeaderboard(response));
      } catch (error) {
        window.console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fn();
  }, [chainId]);

  return (
    <LeaderboardContent className="section">
      <EducationTitle
        title="Leaderboard"
        level={3}
        educationItemSlug="leaderboard"
      />

      <Card bodyStyle={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <Table
            columns={columns}
            dataSource={data}
            loading={isLoading}
            pagination={false}
            className="mb-12"
            rowKey="rowKeyUi"
          />
        </div>
      </Card>
    </LeaderboardContent>
  );
};

export default Leaderboard;
