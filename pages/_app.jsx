import { createWrapper } from 'next-redux-wrapper';
import { App, ConfigProvider } from 'antd';
import PropTypes from 'prop-types';
import { ApolloProvider } from '@apollo/client';
import { THEME_CONFIG } from '@autonolas/frontend-library';

/** wagmi config */
// import { WagmiConfig as WagmiConfigProvider } from 'wagmi';
import { Web3Modal } from 'common-util/Login/config';
// import { wagmiConfig } from 'common-util/Login/config';

// import { Web3Modal } from '../context/Web3Modal'

/** antd theme config */
// import Layout from 'components/Layout';
import GlobalStyle from 'components/GlobalStyles';
import Meta from 'common-util/meta';
import dynamic from 'next/dynamic';
import client from '../apolloClient';
import initStore from '../store';

const Layout = dynamic(() => import('components/Layout'));

const MyApp = ({ Component, pageProps }) => (
  <>
    <GlobalStyle />
    <Meta />
    {/* <Web3Modal> */}
    <ConfigProvider theme={THEME_CONFIG}>
      <App>
        <ApolloProvider client={client}>
          {/* <WagmiConfigProvider config={wagmiConfig}> */}
          <Web3Modal>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Web3Modal>
          {/* </WagmiConfigProvider> */}
        </ApolloProvider>
      </App>
    </ConfigProvider>
    {/* </Web3Modal> */}
  </>
);

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

const wrapper = createWrapper(initStore);
export default wrapper.withRedux(MyApp);
