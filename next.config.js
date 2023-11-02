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
            value: "frame-ancestors 'none'; report-uri /csp-report;",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-XSS-Protection',
            value: '0',
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
