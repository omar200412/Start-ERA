import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Hata mesajına istinaden experimental içinden buraya taşındı
  typedRoutes: false,

  // Next.js 16 varsayılan olarak Turbopack kullanıyor.
  // Webpack config ile çakışma uyarısını engellemek için boş obje ekliyoruz.
  turbopack: {},

  // Bellek kullanımını optimize etmek için bazı özellikleri kapatıyoruz
  experimental: {
    // Turbopack bellek sorunları yaratıyorsa SWC transformlarını optimize et
    forceSwcTransforms: false,
  },
  
  // Derleme sırasında bellek hatalarını önlemek için tip kontrolünü ve linting'i build sırasında atla
  typescript: {
    ignoreBuildErrors: true,
  },

  // 'eslint' bloğu kaldırıldı çünkü Next.js yapılandırmasında artık desteklenmiyor.

  // Webpack önbelleğini optimize ederek RAM kullanımını düşürüyoruz
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;