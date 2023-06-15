/* eslint-disable jest/require-hook */
import App from 'next/app';
import { createWrapper } from 'next-redux-wrapper';
import PropTypes from 'prop-types';

import { WagmiConfig } from 'wagmi';

import Meta from 'common-util/meta';
import GlobalStyle from 'components/GlobalStyles';
import Layout from 'components/Layout';
import { wagmiConfig } from 'common-util/Login/config';
import initStore from '../store';

require('../styles/antd.less');

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <GlobalStyle />
        <Meta />
        <WagmiConfig config={wagmiConfig}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WagmiConfig>
      </>
    );
  }
}

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})])
    .isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

const wrapper = createWrapper(initStore);
export default wrapper.withRedux(MyApp);
