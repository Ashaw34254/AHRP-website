/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Specify the workspace root to avoid multiple lockfile warnings
  experimental: {
    turbopack: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;
