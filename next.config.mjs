/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://eknihovna.vercel.app/api/:path*', // Proxy to the production API
        },
      ];
    },
  };

export default nextConfig;
