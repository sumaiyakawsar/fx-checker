/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // GitHub Pages can't run the Next.js image optimizer
  },
  // Only needed if publishing to username.github.io/repo-name (project page)
  basePath: '/fx-checker',
  assetPrefix: '/fx-checker/',
};

export default nextConfig;
