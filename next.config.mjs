/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gera um site 100% estático na pasta /out (hospedável de graça em qualquer lugar)
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
