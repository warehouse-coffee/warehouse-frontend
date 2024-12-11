/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'lucide-react'
  ],
  images: {
    remotePatterns: [
      { hostname: '**' }
    ]
  }
}

export default nextConfig
