import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_TENANT_ID: process.env.NEXT_PUBLIC_TENANT_ID,
    NEXT_PUBLIC_SITE_ID: process.env.NEXT_PUBLIC_SITE_ID,
    NEXT_PUBLIC_FORM_ID: process.env.NEXT_PUBLIC_FORM_ID,
    NEXT_PUBLIC_SECRET_KEY: process.env.NEXT_PUBLIC_SECRET_KEY,
    NEXT_PUBLIC_IDCARD_API_URL: process.env.NEXT_PUBLIC_IDCARD_API_URL,
    NEXT_PUBLIC_AI_GATEWAY_URL: process.env.NEXT_PUBLIC_AI_GATEWAY_URL,
  },
};

export default nextConfig;
