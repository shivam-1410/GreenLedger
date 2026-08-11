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
      { source: '/user-onboarding', destination: '/onboarding', permanent: true },
      { source: '/wizard', destination: '/onboarding', permanent: true },
      { source: '/onboard', destination: '/onboarding', permanent: true },
      { source: '/monitoring', destination: '/analytics', permanent: true },
      { source: '/telemetry', destination: '/analytics', permanent: true },
      { source: '/metrics', destination: '/analytics', permanent: true },
      { source: '/feedbacks', destination: '/feedback', permanent: true },
      { source: '/reviews', destination: '/feedback', permanent: true },
      { source: '/user-feedback', destination: '/feedback', permanent: true },
      { source: '/proofs', destination: '/proof', permanent: true },
      { source: '/user-proofs', destination: '/proof', permanent: true },
      { source: '/interactions', destination: '/proof', permanent: true },
    ];
  },
};

module.exports = nextConfig;

