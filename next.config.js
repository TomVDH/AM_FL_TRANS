const { execSync } = require('child_process');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  env: {
    NEXT_PUBLIC_GIT_HASH: (() => {
      try {
        return execSync('git rev-parse --short HEAD').toString().trim();
      } catch {
        return 'dev';
      }
    })(),
  },
}

module.exports = nextConfig