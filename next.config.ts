import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    process.env.REPLIT_DOMAINS || "",
    "*.replit.dev",
    "*.janeway.replit.dev",
  ].filter(Boolean),
};

export default nextConfig;
