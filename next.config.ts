import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qfmqxlvgjxmpqhdhnuhc.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/photos/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
