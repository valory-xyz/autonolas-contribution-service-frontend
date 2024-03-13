import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { ApolloProvider } from '@apollo/client';
import { THEME_CONFIG } from '@autonolas/frontend-library';

/** wagmi config */
import { WagmiProvider, cookieToInitialState } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from 'common-util/Login/config';

/** antd theme config */
import GlobalStyle from 'components/GlobalStyles';
import Meta from 'common-util/meta';
import dynamic from 'next/dynamic';
import client from '../apolloClient';
import { store } from '../store';

const Layout = dynamic(() => import('components/Layout'));

const queryClient = new QueryClient();

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
