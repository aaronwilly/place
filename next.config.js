const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['metasalt.io', 'minedn.io', 'ipfs.io', 'ipfs.moralis.io', 'nftavatarmaker.com', 'lh3.googleusercontent.com']
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  },
}

module.exports = nextConfig
