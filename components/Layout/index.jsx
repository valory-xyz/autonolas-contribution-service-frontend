import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Layout, Menu, Grid } from 'antd/lib';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { setIsVerified, setMemoryDetails } from 'store/setup/actions';
import { getMemoryDetails } from 'common-util/api';
import Login from '../Login';
import Footer from './Footer';
import ServiceStatus from './ServiceStatus';
import { getAddressStatus } from './utils';
import {
  CustomLayout,
  Logo,
  RightMenu,
  LoginXsContainer,
  CustomHeader,
} from './styles';

const LogoSvg = dynamic(() => import('common-util/SVGs/logo'));

const { Content } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [
  { key: 'coordinate', label: 'Coordinate' },
  { key: 'docs', label: 'Docs' },
];

const INTERVAL = 10000;

const NavigationBar = ({ children }) => {
  const screens = useBreakpoint();
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState('homepage');
  const { pathname } = router;

  const dispatch = useDispatch();
  const account = useSelector((state) => get(state, 'setup.account'));
  const chainId = useSelector((state) => get(state, 'setup.chainId'));

  const getMembers = async () => {
    const { response } = await getMemoryDetails();
    dispatch(setMemoryDetails(response));
  };

  useEffect(() => {
    // on first render, if there is no account (ie. wallet not connected),
    // mark as not verified
    if (!account) {
      dispatch(setIsVerified(false));
    }

    getMembers();
  }, []);

  // poll details
  useEffect(() => {
    const interval = setInterval(() => {
      getMembers();
    }, INTERVAL);

    return () => {
      clearTimeout(interval);
    };
  }, []);

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
  }, [account, chainId]);

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
  };

  const logo = (
    <Logo onClick={() => router.push('/')}>
      <LogoSvg />
    </Logo>
  );

  const isCoordinatePage = ['coordinate', 'member-chat'].some((e) => pathname.includes(e));

  return (
    <CustomLayout isCoordinatePage={isCoordinatePage}>
      <CustomHeader>
        {logo}

        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onClick={handleMenuItemClick}
        />

        {!screens.xs && (
          <RightMenu>
            <Login />
          </RightMenu>
        )}
      </CustomHeader>

      <Content className="site-layout">
        <div className="site-layout-background">
          {!!screens.xs && (
            <LoginXsContainer>
              <Login />
            </LoginXsContainer>
          )}
          {children}
        </div>

        {!isCoordinatePage && (
          <div className="contribute-footer">
            <Footer />
          </div>
        )}
      </Content>

      {!isCoordinatePage && <ServiceStatus />}
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
