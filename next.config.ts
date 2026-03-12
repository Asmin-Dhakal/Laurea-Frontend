import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow connections from other devices on the same LAN (useful for exam day tablet access)
  allowedDevOrigins: [
    'http://192.168.1.162:3000',
    'http://localhost:3000',
  ],
};

export default nextConfig;
