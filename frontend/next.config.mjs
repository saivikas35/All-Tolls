/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:4000/api/:path*' // Proxy to Backend on port 4000
      },
      {
        source: '/uploads/:path*',
        destination: 'http://127.0.0.1:4000/api/download/:path*' // Proxy /uploads/ directly to download endpoint
      }
    ];
  }
};
export default nextConfig;
