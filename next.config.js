module.exports = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
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
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=604800, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
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
