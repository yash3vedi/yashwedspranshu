/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // builds a static site into /out — works on Vercel, Netlify, any host
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
