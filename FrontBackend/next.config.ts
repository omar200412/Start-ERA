import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // TypeScript hatalarını build sırasında yoksay (Hızlı deploy için)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // NOT: 'eslint' bloğu kaldırıldı. Next.js 15+ sürümlerinde bu ayar next.config.ts içinde desteklenmez.
  // ESLint, varsayılan olarak build sırasında çalışır veya ayrı bir config dosyasından yönetilir.

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

  // 👇 API Yönlendirmesi
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "/api", // Tüm /api/... istekleri api/index.py dosyasına gider
      },
    ];
  },
};

export default nextConfig;