/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        // Proxy all /api/* requests to FastAPI backend on port 4000
        source: '/api/:path*',
        destination: 'http://127.0.0.1:4000/api/:path*',
      },
      {
        // Proxy /uploads/<file> to FastAPI download endpoint so filenames are preserved
        // Maps: /uploads/foo.pdf  →  http://127.0.0.1:4000/api/download/foo.pdf
        source: '/uploads/:filename',
        destination: 'http://127.0.0.1:4000/api/download/:filename',
      },
    ];
  },
};
export default nextConfig;
