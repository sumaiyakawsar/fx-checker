/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = "";
let basePath = "";

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true, // GitHub Pages can't run the Next.js image optimizer
  },
  assetPrefix: assetPrefix,
  basePath: basePath,
};

export default nextConfig;
