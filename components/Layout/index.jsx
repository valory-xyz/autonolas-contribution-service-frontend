import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Layout, Grid, Button } from 'antd';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { notifyError } from '@autonolas/frontend-library';
import {
  CalendarOutlined,
  FileTextOutlined,
  MessageOutlined,
  NodeIndexOutlined,
  RobotOutlined,
  StarOutlined,
  TrophyOutlined,
  TwitterOutlined,
  UserOutlined,
} from '@ant-design/icons';
// import { watchAccount } from '@wagmi/core';

import {
  setIsVerified,
  setMemoryDetails,
  setIsMemoryDetailsLoading,
  setLeaderboard,
  setIsLeaderboardLoading,
} from 'store/setup';
import { getLeaderboardList, getMemoryDetails } from 'common-util/api';
// import useOrbis from 'common-util/hooks/useOrbis';
import Login from '../Login';
import Footer from './Footer';
import { getAddressStatus } from './utils';
import {
  CustomLayout,
  Logo,
  RightMenu,
  CustomHeader,
  CustomMenu,
} from './styles';

const LogoSvg = dynamic(() => import('common-util/SVGs/logo'));
const ServiceStatus = dynamic(() => import('./ServiceStatus'), { ssr: false });

const { Content } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [
  { key: 'leaderboard', label: 'Leaderboard', icon: <TrophyOutlined /> },
  { key: 'tweet', label: 'Tweet', icon: <TwitterOutlined /> },
  { key: 'members', label: 'Members', icon: <UserOutlined /> },
  { key: 'chat', label: 'Chat', icon: <MessageOutlined /> },
  { key: 'predict', label: 'Predict', icon: <StarOutlined /> },
  { key: 'roadmap', label: 'Roadmap', icon: <NodeIndexOutlined /> },
  { key: 'calendar', label: 'Calendar', icon: <CalendarOutlined /> },
  { key: 'chatbot', label: 'Chatbot', icon: <RobotOutlined /> },
  { key: 'docs', label: 'Docs', icon: <FileTextOutlined /> },
];

const INTERVAL = 10000;

const NavigationBar = ({ children }) => {
  const screens = useBreakpoint();
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState('homepage');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { pathname } = router;
  // const { isOrbisConnected, disconnect, updateOrbisConnectionState } = useOrbis();

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
      setSelectedMenu(name || 'homepage');
    }
  }, [pathname]);

  const handleMenuItemClick = ({ key }) => {
    router.push(key === 'homepage' ? '/' : `/${key}`);
    setSelectedMenu(key);
    if (!screens.md) {
      setIsMenuVisible(false);
    }
  };

  // useEffect(() => {
  //   updateOrbisConnectionState();
  // }, []);

  // TODO: watchAccount has been updated - https://wagmi.sh/core/api/actions/watchAccount
  // useEffect(() => {
  //   const unwatch = watchAccount((newAccount) => {
  //     if (
  //       account
  //       && (newAccount.address !== account || isOrbisConnected)
  //       && isOrbisConnected !== undefined
  //     ) {
  //       disconnect();
  //     }
  //   });

  //   return () => unwatch();
  // }, [account, disconnect, isOrbisConnected]);

  const logo = (
    <Logo onClick={() => router.push('/')}>
      <LogoSvg />
    </Logo>
  );

  const isPadded = ['chat', 'member-chat'].some((e) => pathname.includes(e));

  return (
    <CustomLayout ispadded={isPadded.toString()}>
      <CustomHeader>
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
      </CustomHeader>

      {(screens.md || isMenuVisible) && (
        <CustomMenu
          theme="light"
          mode="vertical"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onClick={handleMenuItemClick}
        />
      )}

      <Content
        className="site-layout"
        style={{
          marginLeft: screens.md ? '200px' : '0',
        }}
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
