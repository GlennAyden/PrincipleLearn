// next.config.js
const path = require('path');

/** @type {import(next).NextConfig} */
const nextConfig = [object Object] typescript:[object Object] ignoreBuildErrors: true,
  },
  eslint: [object Object] ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, src
    return config;
  },
};

module.exports = nextConfig;
