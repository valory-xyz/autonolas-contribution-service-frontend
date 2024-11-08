import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Layout, Grid, Button, Typography } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { notifyError } from '@autonolas/frontend-library';
import {
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  // MessageOutlined,
  NodeIndexOutlined,
  // RobotOutlined,
  // StarOutlined,
  TrophyOutlined,
  TwitterOutlined,
  // UserOutlined,
} from '@ant-design/icons';
import { watchAccount } from '@wagmi/core';

import {
  setIsVerified,
  setMemoryDetails,
  setIsMemoryDetailsLoading,
  setLeaderboard,
  setIsLeaderboardLoading,
} from 'store/setup';
import { getLeaderboardList, getMemoryDetails } from 'common-util/api';
import useOrbis from 'common-util/hooks/useOrbis';
import { wagmiConfig } from 'common-util/Login/config';
import Footer from './Footer';
import { getAddressStatus } from './utils';
import {
  CustomLayout,
  CustomHeaderContent,
  Banner,
  Logo,
  RightMenu,
  CustomHeader,
  CustomMenu,
} from './styles';
import { MENU_WIDTH } from 'util/constants';

const Login = dynamic(() => import('../Login'));
const LogoSvg = dynamic(() => import('common-util/SVGs/logo'));
const ServiceStatus = dynamic(() => import('./ServiceStatus'), { ssr: false });

const { Content } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const menuItems = [
  { key: 'leaderboard', label: 'Leaderboard', icon: <TrophyOutlined /> },
  { key: 'staking', label: 'Staking', icon: <DollarOutlined /> },
  { key: 'tweet', label: 'Tweet', icon: <TwitterOutlined /> },
  // { key: 'members', label: 'Members', icon: <UserOutlined /> },
  // { key: 'chat', label: 'Chat', icon: <MessageOutlined /> },
  // { key: 'predict', label: 'Predict', icon: <StarOutlined /> },
  { key: 'roadmap', label: 'Roadmap', icon: <NodeIndexOutlined /> },
  { key: 'calendar', label: 'Calendar', icon: <CalendarOutlined /> },
  // { key: 'chatbot', label: 'Chatbot', icon: <RobotOutlined /> },
  { key: 'docs', label: 'Docs', icon: <FileTextOutlined /> },
];

const INTERVAL = 10000;

const NavigationBar = ({ children }) => {
  const screens = useBreakpoint();
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState('leaderboard');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { pathname } = router;
  const { isOrbisConnected, disconnect, updateOrbisConnectionState } = useOrbis();

  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const handleBannerClose = () => setIsBannerVisible(false)

  const dispatch = useDispatch();
  const account = useSelector((state) => get(state, 'setup.account'));
  const chainId = useSelector((state) => get(state, 'setup.chainId'));

  const getMembers = useCallback(async () => {
    const { response } = await getMemoryDetails();
    dispatch(setMemoryDetails(response));
  }, [dispatch]);

  // load leaderboard list only once on page load
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        dispatch(setIsLeaderboardLoading(true));
        const list = await getLeaderboardList();
        dispatch(setLeaderboard(list));
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setIsLeaderboardLoading(false));
      }
    };

    fetchLeaderboard();
  }, [chainId, dispatch]);

  useEffect(() => {
    // on first render, if there is no account (ie. wallet not connected),
    // mark as not verified
    if (!account) {
      dispatch(setIsVerified(false));
    }

    const getData = async () => {
      try {
        dispatch(setIsMemoryDetailsLoading(true));
        await getMembers();
      } catch (error) {
        notifyError('Error fetching members');
      } finally {
        dispatch(setIsMemoryDetailsLoading(false));
      }
    };

    getData();
  }, [account, dispatch, getMembers]);

  // poll details
  useEffect(() => {
    const interval = setInterval(() => {
      getMembers();
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [getMembers]);

  /**
   * fetch if wallet is verified on page load
   */
  useEffect(() => {
    const fn = async () => {
      if (account && chainId) {
        try {
          const response = await getAddressStatus(account);
          dispatch(setIsVerified(response));
        } catch (error) {
          window.console.error(error);
        }
      }
    };
    fn();
  }, [account, chainId, dispatch]);

  // to set default menu on first render
  useEffect(() => {
    if (pathname) {
      const name = pathname.split('/')[1];
      setSelectedMenu(name || 'leaderboard');

      if (pathname.includes('staking')) {
        setIsBannerVisible(false)
      }
    }
  }, [pathname]);

  const handleMenuItemClick = ({ key }) => {
    router.push(`/${key}`);
    setSelectedMenu(key);
    if (!screens.md) {
      setIsMenuVisible(false);
    }
  };

  useEffect(() => {
    updateOrbisConnectionState();
  }, [updateOrbisConnectionState]);

  useEffect(() => {
    const unwatch = watchAccount(wagmiConfig, {
      onChange(data) {
        if (
          account
          && (data.address !== account || isOrbisConnected)
          && isOrbisConnected !== undefined
        ) {
          disconnect();
        }
      },
    });

    return () => unwatch();
  }, [account, disconnect, isOrbisConnected]);

  const logo = (
    <Logo onClick={() => router.push('/')}>
      <LogoSvg />
    </Logo>
  );

  const isPadded = ['chat', 'member-chat'].some((e) => pathname.includes(e));

  return (
    <CustomLayout ispadded={isPadded.toString()} isBannerVisible={isBannerVisible.toString()}>
      <CustomHeader isBannerVisible={isBannerVisible.toString()}>
        {isBannerVisible && (
          <Banner
            message={(
              <>
                <Text ellipsis>
                  <InfoCircleFilled className="mr-8" style={{ color: '#1677FF' }}/>
                  Contribute staking is live! Spread the word about Olas on Twitter and have a chance to earn rewards.
                </Text>
                {' '}
                <Link href="/staking">
                Set up staking now
              </Link>
             </>
            )}
            type="info"
            closable
            onClose={handleBannerClose}
          />
        )}
        <CustomHeaderContent>
          {logo}
          <RightMenu>
            {!screens.md && (
              <Button
                className="mr-8"
                onClick={() => setIsMenuVisible(!isMenuVisible)}
              >
                Menu
              </Button>
            )}
            <Login />
          </RightMenu>
        </CustomHeaderContent>
      </CustomHeader>

      {(screens.md || isMenuVisible) && (
        <CustomMenu
          theme="light"
          mode="vertical"
          defaultSelectedKeys={[selectedMenu]}
          selectedKeys={[selectedMenu]}
          items={menuItems}
          isBannerVisible={isBannerVisible.toString()}
          onClick={handleMenuItemClick}
        />
      )}

      <Content
        className="site-layout"
        style={{ marginLeft: screens.md ? `${MENU_WIDTH}px` : '0' }}
      >
        <div className="site-layout-background">{children}</div>

        {!isPadded && (
          <div className="contribute-footer">
            <Footer />
          </div>
        )}
      </Content>

      {!isPadded && <ServiceStatus />}
    </CustomLayout>
  );
};

NavigationBar.propTypes = {
  children: PropTypes.element,
};

NavigationBar.defaultProps = {
  children: null,
};

export default NavigationBar;
