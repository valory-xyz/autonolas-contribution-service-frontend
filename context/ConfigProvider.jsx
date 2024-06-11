import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ConfigProvider as AntdConfigProvider } from 'antd';

import { THEME_CONFIG } from '@autonolas/frontend-library';

export const ThemeConfigProvider = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <AntdConfigProvider theme={THEME_CONFIG}>
      {isMounted ? children : ''}
    </AntdConfigProvider>
  );
};

ThemeConfigProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
