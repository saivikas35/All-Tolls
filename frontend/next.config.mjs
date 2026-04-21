/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:4001/api/:path*' // Proxy to Backend
      }
    ];
  }
};
export default nextConfig;
