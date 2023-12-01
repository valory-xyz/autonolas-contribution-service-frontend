import { Button, Tooltip, Grid } from 'antd';
import { useSelector } from 'react-redux';

import useOrbis from 'common-util/hooks/useOrbis';

const { useBreakpoint } = Grid;

const SignInToOrbis = () => {
  const isOrbisConnected = useSelector((state) => state.setup.isConnected);
  const { connect, disconnect, isLoading } = useOrbis();
  const screens = useBreakpoint();

  return (
    !screens.xs && (
    <Tooltip
      title="Orbis enables you to use social features like Chat and Private Messages."
      delay={2000}
    >
      <Button
        loading={isLoading}
        onClick={() => {
          if (isOrbisConnected) {
            disconnect();
          } else {
            connect();
          }
        }}
      >
        {isOrbisConnected ? 'Sign out of Orbis' : 'Sign in to Orbis'}
      </Button>
    </Tooltip>
    )
  );
};

export default SignInToOrbis;
