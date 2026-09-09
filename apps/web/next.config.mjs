/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = 'vicin';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isGithubActions ? `/${repoName}` : '',
  trailingSlash: true,
  transpilePackages: ['@vicin/shared', '@vicin/ui'],
};

export default nextConfig;
