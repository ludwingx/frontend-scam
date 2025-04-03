import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["firebasestorage.googleapis.com"], // <-- Añade el dominio aquí
  },
};

export default nextConfig;
