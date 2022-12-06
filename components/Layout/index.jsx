import { useState, useEffect } from 'react';
import { Layout, Menu, Grid } from 'antd/lib';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
// import Footer from './Footer';
import Login from '../Login';
import { CustomLayout, Logo, RightMenu } from './styles';

const LogoSvg = dynamic(() => import('common-util/SVGs/logo'));

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

const NavigationBar = ({ children }) => {
  const screens = useBreakpoint();
  const isMobile = !!screens.xs;

  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState('homepage');
  const { pathname } = router;

  // to set default menu on first render
  useEffect(() => {
    if (pathname) {
      const name = pathname.split('/')[1];
      setSelectedMenu(name || null);
    }
  }, [pathname]);

  const handleMenuItemClick = ({ key }) => {
    router.push(key === 'homepage' ? '' : `/${key}`);
    setSelectedMenu(key);
  };

  const logo = (
    <Logo onClick={() => router.push('/')} data-testid="protocol-logo">
      <LogoSvg />
    </Logo>
  );

  // TODO: fix mobile responsiveness and remove the below component
  if (isMobile) {
    return (
      <CustomLayout hasSider>
        <Header>{logo}</Header>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout>
      <Header>
        {logo}

        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[selectedMenu]}
          defaultSelectedKeys={['homepage']}
        >
          <Menu.Item key="homepage" onClick={handleMenuItemClick}>
            Contribute
          </Menu.Item>
          <Menu.Item key="docs" onClick={handleMenuItemClick} disabled>
            Docs
          </Menu.Item>
        </Menu>

        <RightMenu>
          <Login />
        </RightMenu>
      </Header>

      <Content className="site-layout">
        <div className="site-layout-background">{children}</div>
      </Content>

      {/* <Footer /> */}
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
