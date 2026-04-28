import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    ".space-z.ai",
    ".chatglm.site",
  ],
  images: {
    domains: ["cloud.appwrite.io", "avatars.githubusercontent.com"],
  },
};

export default nextConfig;
