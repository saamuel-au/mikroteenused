/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'localhost'],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
