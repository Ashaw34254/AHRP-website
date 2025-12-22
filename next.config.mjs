/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  experimental: {
    proxy: {
      // Skip auth in development
      beforeFiles: process.env.NODE_ENV === 'development' 
        ? undefined 
        : async (request) => {
          const { auth } = await import('./auth');
          return auth(request);
        },
      // Match all routes except static assets
      matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
    },
  },
};

export default nextConfig;
