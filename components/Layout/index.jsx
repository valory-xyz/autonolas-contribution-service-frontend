import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Layout, Menu, Grid } from 'antd/lib';
import PropTypes from 'prop-types';
import Login from '../Login';
import Footer from './Footer';
import {
  CustomLayout, Logo, RightMenu, LoginXsContainer,
} from './styles';

const LogoSvg = dynamic(() => import('common-util/SVGs/logo'));

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

const NavigationBar = ({ children }) => {
  const screens = useBreakpoint();
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState('homepage');
  const { pathname } = router;

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

  return (
    <CustomLayout>
      <Header>
        {logo}

        <Menu theme="light" mode="horizontal" selectedKeys={[selectedMenu]}>
          <Menu.Item key="homepage" onClick={handleMenuItemClick}>
            Contribute
          </Menu.Item>
          <Menu.Item key="documentation" onClick={handleMenuItemClick} disabled>
            Docs
          </Menu.Item>
        </Menu>

        {!screens.xs && (
          <RightMenu>
            <Login />
          </RightMenu>
        )}
      </Header>

      <Content className="site-layout">
        <div className="site-layout-background">
          {!!screens.xs && (
            <LoginXsContainer>
              <Login />
            </LoginXsContainer>
          )}
          {children}
        </div>
      </Content>

      <Footer />
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
