/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gera um site 100% estático na pasta /out (hospedável de graça em qualquer lugar)
  output: 'export',
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
