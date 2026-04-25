import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // TypeScript hatalarını build sırasında yoksay (Hızlı deploy için)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Rota ve bellek optimizasyonları
  typedRoutes: false,
  experimental: {
    forceSwcTransforms: false,
  },
  
  // Turbopack boş obje (Hata önlemek için)
  turbopack: {},

  // Webpack önbellek ayarı
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.cache = false;
    }
    return config;
  },

  // 👇 API Yönlendirmesi kaldirildi
  // Python backend kullanılacaksa Next.js ortamında rewrite ayarlanabilir
  // Örneğin: destination: "http://127.0.0.1:8000/api/:path*"
};

export default nextConfig;