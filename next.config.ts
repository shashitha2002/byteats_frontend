import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Simple configuration
    // OR for newer Next.js versions (recommended):
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      // Add payment API rewrite rules
      {
        source: '/api/payment/:path*',
        destination: 'http://localhost:5003/api/payment/:path*',
      },
      // Add specific rewrites for create-payment-intent
      {
        source: '/api/create-payment-intent',
        destination: 'http://localhost:5003/api/payment/add',
      },
      // Multiple ways to handle verify-payment - with query param
      {
        source: '/api/verify-payment',
        destination: 'http://localhost:5003/api/payment/verify/:payment_intent',
        has: [
          {
            type: 'query',
            key: 'payment_intent',
            value: '(?<payment_intent>.*)',
          },
        ],
      },
      // With path param
      {
        source: '/api/verify-payment/:paymentIntent',
        destination: 'http://localhost:5003/api/payment/verify/:paymentIntent',
      }
    ];
  },
};

export default nextConfig;
