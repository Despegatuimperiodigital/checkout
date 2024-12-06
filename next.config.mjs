/** @type {import('next').NextConfig} */
const nextConfig = {images: {
    domains: ['www.cruzeirogomas.cl'], // Agrega el dominio aquí
  },

  async rewrites() {
    return [
        {
            source: '/api/falabella/:path*',
            destination: 'https://sellercenter-api.falabella.com/:path*',
        },
    ];
},
};


export default nextConfig;
