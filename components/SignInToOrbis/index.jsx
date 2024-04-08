import { LogoutOutlined } from '@ant-design/icons';
import {
  Button, Tooltip, Grid, Dropdown, Menu,
} from 'antd';

import useOrbis from 'common-util/hooks/useOrbis';
import { useRouter } from 'next/router';

const { useBreakpoint } = Grid;

const SignInToOrbis = () => {
  const {
    connect, disconnect, isLoading, isOrbisConnected, profile, address,
  } = useOrbis();
  const screens = useBreakpoint();
  const { push } = useRouter();

  if (screens.xs) return null;

  if (!isOrbisConnected) {
    return (
      <Tooltip
        title="Orbis enables you to use social features like Chat and Private Messages."
        delay={2000}
      >
        <Button loading={isLoading} onClick={connect}>
          Sign in to Orbis
        </Button>
      </Tooltip>
    );
  }

  return (
    <Dropdown.Button
      overlay={(
        <Menu>
          <Menu.Item key="logout" onClick={disconnect}>
            <LogoutOutlined />
            {' '}
            Logout?
          </Menu.Item>
        </Menu>
      )}
      onClick={() => push(`/profile/${address}`)}
      icon={<LogoutOutlined />}
      loading={isLoading}
    >
      {profile?.username || 'Set username'}
    </Dropdown.Button>
  );
};

export default SignInToOrbis;
