/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Always re-fetch server pages when navigating, so progress isn't served from a stale cache.
    staleTimes: { dynamic: 0 },
  },
};
export default nextConfig;