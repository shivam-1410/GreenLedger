const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, './'),
  webpack: (config, { isServer }) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        'sodium-native': false,
      };
    }

    config.ignoreWarnings = [
      { module: /node_modules\/require-addon/ },
      { module: /node_modules\/sodium-native/ },
      { message: /Critical dependency/ },
    ];

    return config;
  },
  async redirects() {
    return [
      { source: '/user-onboarding', destination: '/', permanent: true },
      { source: '/wizard', destination: '/', permanent: true },
      { source: '/onboard', destination: '/', permanent: true },
      { source: '/onboarding', destination: '/', permanent: true },
      { source: '/monitoring', destination: '/analytics', permanent: true },
      { source: '/telemetry', destination: '/analytics', permanent: true },
      { source: '/metrics', destination: '/analytics', permanent: true },
      { source: '/feedbacks', destination: '/feedback', permanent: true },
      { source: '/reviews', destination: '/feedback', permanent: true },
      { source: '/user-feedback', destination: '/feedback', permanent: true },
      { source: '/proof', destination: '/', permanent: true },
      { source: '/proofs', destination: '/', permanent: true },
      { source: '/user-proofs', destination: '/', permanent: true },
      { source: '/interactions', destination: '/', permanent: true },
      { source: '/carbon-calculator', destination: '/calculator', permanent: true },
      { source: '/carbon-audit', destination: '/calculator', permanent: true },
      { source: '/contract-inspector', destination: '/inspector', permanent: true },
      { source: '/soroban-inspector', destination: '/inspector', permanent: true },
      { source: '/impact-leaderboard', destination: '/leaderboard', permanent: true },
      { source: '/top-offsetters', destination: '/leaderboard', permanent: true },
    ];
  },
};

module.exports = nextConfig;
