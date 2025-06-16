// /** @type {import('next').NextConfig} */
 

// const nextConfig = {
//    experimental: {
//     serverActions: true,
//     serverComponentsExternalPackages: ['mongoose']
//    },
//    images: {
//     domains: ['m.media-amazon.com']
//    }
//   // No need for appDir in Next.js 15
// }
// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {}, // instead of `true`
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
