import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { ApolloProvider } from '@apollo/client';
import { THEME_CONFIG, COLOR } from '@autonolas/frontend-library';

/** wagmi config */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, cookieToInitialState } from 'wagmi';
import { createWeb3Modal } from '@web3modal/wagmi/react'; /* eslint-disable-line import/no-unresolved */
import { wagmiConfig } from 'common-util/Login/config';

/** antd theme config */
import GlobalStyle from 'components/GlobalStyles';
import Meta from 'common-util/meta';
import dynamic from 'next/dynamic';
import client from '../apolloClient';
import { store } from '../store';

const Layout = dynamic(() => import('components/Layout'));

const queryClient = new QueryClient();

export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

// eslint-disable-next-line jest/require-hook
createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: 'light',
  themeVariables: {
    '--w3m-border-radius-master': '0.7125px',
    '--w3m-font-size-master': '11px',
    '--w3m-accent': COLOR.PRIMARY,
  },
});

const MyApp = ({ Component, pageProps }) => {
  const initialState = cookieToInitialState(wagmiConfig);

  return (
    <>
      <GlobalStyle />
      <Meta />

      <Provider store={store}>
        <ConfigProvider theme={THEME_CONFIG}>
          <WagmiProvider config={wagmiConfig} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
              <ApolloProvider client={client}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ApolloProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ConfigProvider>
      </Provider>
    </>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  return { pageProps };
};

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})])
    .isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default MyApp;
