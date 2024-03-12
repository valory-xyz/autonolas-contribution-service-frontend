import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { ApolloProvider } from '@apollo/client';
import { THEME_CONFIG } from '@autonolas/frontend-library';

import { wagmiConfig } from 'common-util/Login/config';

/** wagmi config */
// import { WagmiConfig as WagmiConfigProvider } from 'wagmi';
// import { wagmiConfig } from 'common-util/Login/config';
import { WagmiProvider, cookieToInitialState } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Web3Modal } from '../context/Web3Modal'

/** antd theme config */
// import Layout from 'components/Layout';
import GlobalStyle from 'components/GlobalStyles';
import Meta from 'common-util/meta';
import dynamic from 'next/dynamic';
import client from '../apolloClient';
import { wrapper } from '../store';

const Layout = dynamic(() => import('components/Layout'));

const queryClient = new QueryClient();

const MyApp = ({ Component, ...rest }) => {
  const initialState = cookieToInitialState(wagmiConfig);
  const { store, props } = wrapper.useWrappedStore(rest);
  console.log('rendering app', store.getState());

  return (
    <>
      <GlobalStyle />
      <Meta />

      {/* <Web3Modal> */}
      <Provider store={store}>
        <ConfigProvider theme={THEME_CONFIG}>
          <WagmiProvider config={wagmiConfig} initialState={initialState}>

            {/* <Layout>
              <Component {...props.pageProps} />
            </Layout> */}

            <QueryClientProvider client={queryClient}>

              <ApolloProvider client={client}>
                <Layout>
                  <div>HELLO 123</div>

                  {/* <Component {...props.pageProps} /> */}
                </Layout>
              </ApolloProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ConfigProvider>
      </Provider>
      {/* </Web3Modal> */}
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
