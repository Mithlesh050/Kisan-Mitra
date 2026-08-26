
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.khetivyapar.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.jagranimages.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.indiafilings.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'smeventure.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kj1bcdn.b-cdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.finshastra.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.etimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.indianexpress.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            // While '*' is convenient for development,
            // for production, you should list specific trusted origins.
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  experimental: {
    allowedDevOrigins: [
      'https://56567-firebase-studio-1747214151338.cluster-nzwlpk54dvagsxetkvxzbvslyi.cloudworkstations.dev',
      'https://9000-firebase-studio-1747214151338.cluster-nzwlpk54dvagsxetkvxzbvslyi.cloudworkstations.dev',
      'https://6000-firebase-studio-1747214151338.cluster-nzwlpk54dvagsxetkvxzbvslyi.cloudworkstations.dev',
    ],
  },
  devIndicators: { // Ensuring this existing configuration is maintained
    autoPrerender: false,
  },
};

export default nextConfig;
