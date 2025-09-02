/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow external hosts
  async rewrites() {
    return [];
  },
  // Configure hostname
  experimental: {
    allowedHosts: ['liar.nyc', 'www.liar.nyc', 'localhost']
  }
};

export default nextConfig;
