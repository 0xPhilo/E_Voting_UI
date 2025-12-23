/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Configure environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  },

  // Configure images for external sources (if needed for kandidat photos)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.101.58',//testing use
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },

  // Allow cross-origin requests from network devices in development
  allowedDevOrigins: [
    'http://192.168.*',
    'http://10.*',
    'http://172.16.*',
    'http://localhost:3000',
  ],
};

export default nextConfig;
