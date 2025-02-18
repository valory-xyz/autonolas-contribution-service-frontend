import { InfoCircleFilled, MenuOutlined } from '@ant-design/icons';
import {
  CalendarOutlined,
  FileTextOutlined, // MessageOutlined,
  NodeIndexOutlined,
  NotificationOutlined, // RobotOutlined,
  // StarOutlined,
  TrophyOutlined,
  XOutlined, // UserOutlined,
} from '@ant-design/icons';
import { watchAccount } from '@wagmi/core';
import { Button, Dropdown, Grid, Layout, Typography } from 'antd';
import { get } from 'lodash';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { notifyError } from '@autonolas/frontend-library';

import { wagmiConfig } from 'common-util/Login/config';
import { getLeaderboardList, getMemoryDetails } from 'common-util/api';
import useOrbis from 'common-util/hooks/useOrbis';
import {
  setIsLeaderboardLoading,
  setIsMemoryDetailsLoading,
  setIsVerified,
  setLeaderboard,
  setMemoryDetails,
} from 'store/setup';
import { MENU_WIDTH } from 'util/constants';

import Footer from './Footer';
import {
  Banner,
  CustomHeader,
  CustomHeaderContent,
  CustomLayout,
  CustomMenu,
  Logo,
  RightMenu,
} from './styles';
import { getAddressStatus } from './utils';

const Login = dynamic(() => import('../Login'));
const LogoSvg = dynamic(() => import('common-util/SVGs/logo'));
const ServiceStatus = dynamic(() => import('./ServiceStatus'), { ssr: false });

const { Content } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const BurgerMenuButton = styled(Button)`
  padding: 8px;
  margin-top: auto;
  margin-bottom: auto;
`;

const HeaderLeftContent = styled.div`
  display: flex;
  flex-direction: row;
`;

const ExternalLink = ({ href, label }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {label}
  </a>
);

const menuItems = [
  { key: 'leaderboard', label: 'Leaderboard', icon: <TrophyOutlined /> },
  { key: 'staking', label: 'Staking', icon: <NotificationOutlined /> },
  { key: 'post', label: 'Post', icon: <XOutlined /> },
  // { key: 'members', label: 'Members', icon: <UserOutlined /> },
  // { key: 'chat', label: 'Chat', icon: <MessageOutlined /> },
  // { key: 'predict', label: 'Predict', icon: <StarOutlined /> },
  { key: 'roadmap', label: 'Roadmap', icon: <NodeIndexOutlined /> },
  { key: 'calendar', label: 'Calendar', icon: <CalendarOutlined /> },
  // { key: 'chatbot', label: 'Chatbot', icon: <RobotOutlined /> },
  { key: 'docs', label: 'Docs', icon: <FileTextOutlined /> },
];

const navItems = [
  { key: 'bond', label: <ExternalLink label="Bond" href="https://bond.olas.network/" /> },
  {
    key: 'build',
    label: <ExternalLink label="Build" href="https://build.olas.network/" />,
  },
  {
    key: 'contribute',
    label: <span>Contribute</span>,
    disabled: true,
  },
  {
    key: 'govern',
    label: <ExternalLink label="Govern" href="https://govern.olas.network/" />,
  },
  {
    key: 'launch',
    label: <ExternalLink label="Launch" href="https://launch.olas.network/" />,
  },
  {
    key: 'operate',
    label: <ExternalLink label="Operate" href="https://operate.olas.network/" />,
  },
  {
    type: 'divider',
  },
  {
    key: 'registry',
    label: <ExternalLink label="Registry" href="https://registry.olas.network/" />,
  },
  {
    type: 'divider',
  },
  {
    key: 'olas',
    label: <ExternalLink label="Olas website" href="https://olas.network/" />,
  },
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
  const handleBannerClose = () => setIsBannerVisible(false);

  const dispatch = useDispatch();
  const account = useSelector((state) => get(state, 'setup.account'));
  const chainId = useSelector((state) => get(state, 'setup.chainId'));

  const getMembers = useCallback(async () => {
    const { response } = await getMemoryDetails();
    dispatch(setMemoryDetails(response));
  }, [dispatch]);

  const NavDropdown = () => {
    return (
      <Dropdown
        menu={{
          items: navItems,
          selectedKeys: ['contribute'],
        }}
        trigger={['click']}
      >
        <BurgerMenuButton>
          <MenuOutlined />
        </BurgerMenuButton>
      </Dropdown>
    );
  };

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
        setIsBannerVisible(false);
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
          account &&
          (data.address !== account || isOrbisConnected) &&
          isOrbisConnected !== undefined
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
            message={
              <>
                <Text ellipsis>
                  <InfoCircleFilled className="mr-8" style={{ color: '#1677FF' }} />
                  Contribute staking is live! Spread the word about Olas on X and have a chance to
                  earn rewards.
                </Text>{' '}
                <Link href="/staking">Set up staking now</Link>
              </>
            }
            type="info"
            closable
            onClose={handleBannerClose}
          />
        )}
        <CustomHeaderContent>
          <HeaderLeftContent>
            {logo}
            <NavDropdown />
          </HeaderLeftContent>
          <RightMenu>
            {!screens.md && (
              <Button className="mr-8" onClick={() => setIsMenuVisible(!isMenuVisible)}>
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

      <Content className="site-layout" style={{ marginLeft: screens.md ? `${MENU_WIDTH}px` : '0' }}>
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
