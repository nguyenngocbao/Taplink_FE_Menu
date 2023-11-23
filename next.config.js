/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loremflickr.com'
      }
    ]
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
  }
};

module.exports = nextConfig;
