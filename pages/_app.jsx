import { createWrapper } from 'next-redux-wrapper';
import { App, ConfigProvider } from 'antd';
import PropTypes from 'prop-types';
import { ApolloProvider } from '@apollo/client';
import { THEME_CONFIG } from '@autonolas/frontend-library';

/** wagmi config */
import { WagmiConfig as WagmiConfigProvider } from 'wagmi';
import { wagmiConfig } from 'common-util/Login/config';

/** antd theme config */
import Layout from 'components/Layout';
import GlobalStyle from 'components/GlobalStyles';
import Meta from 'common-util/meta';
import client from '../apolloClient';
import initStore from '../store';

const MyApp = ({ Component, pageProps }) => (
  <>
    <GlobalStyle />
    <Meta />
    <ConfigProvider theme={THEME_CONFIG}>
      <App>
        <ApolloProvider client={client}>
          <WagmiConfigProvider config={wagmiConfig}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </WagmiConfigProvider>
        </ApolloProvider>
      </App>
    </ConfigProvider>
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
