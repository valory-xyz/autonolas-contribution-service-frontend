const withAntdLess = require('next-plugin-antd-less');

module.exports = {
  ...withAntdLess({
    lessVarsFilePathAppendToEndOfContent: false,
    cssLoaderOptions: { importLoaders: 1 },
    lessLoaderOptions: { javascriptEnabled: true },
    productionBrowserSourceMaps: true,
    webpack(config) {
      return config;
    },
  }),
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
  publicRuntimeConfig: { },
  images: {
    domains: ['github.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.autonolas.tech',
      },
    ],
  },
};
