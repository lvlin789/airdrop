import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.moralis.io',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'logo.moralis.io',
        port: '',
        pathname: '/**', // 可以写成 /** 允许全部路径
      },
      {
        protocol: 'https',
        hostname: 'cdn.moralis.io',
        port: '',
        pathname: '/**', // 可以写成 /** 允许全部路径
      },
    ]
  },
};

export default nextConfig;
