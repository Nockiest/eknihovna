/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/<route-name>",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['books.google.com'],  // Přidej tuto doménu nebo jinou, odkud obrázek pochází
  },
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'assets.example.com',
  //       port: '',
  //       pathname: '/account123/**',
  //     },
  //   ],
  // },
};

export default nextConfig
