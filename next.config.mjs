/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['images.unsplash.com'], // เพิ่ม domain ที่อนุญาตให้โหลดรูปภาพ
    },
};

export default nextConfig;
