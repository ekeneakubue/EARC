import type { NextConfig } from "next";
import path from "node:path";

function r2Hostname() {
  const publicUrl = process.env.R2_PUBLIC_URL?.trim();

  if (!publicUrl) {
    return null;
  }

  try {
    return new URL(publicUrl).hostname;
  } catch {
    return null;
  }
}

const hostname = r2Hostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(hostname
        ? [
            {
              protocol: "https" as const,
              hostname,
              port: "",
              pathname: "/**",
              search: "",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
