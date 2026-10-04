import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Detail investasi dulu berada di bawah /investor/portofolio
      {
        source: "/investor/portofolio/:investmentId",
        destination: "/investor/riwayat/:investmentId",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
