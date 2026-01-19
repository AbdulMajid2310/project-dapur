const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "7000",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
