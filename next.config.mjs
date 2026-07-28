/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
       unoptimized: true,
       remotePatterns:[
        {
            protocol:"https",
            hostname:"images.pexels.com"
        },
        {
            protocol: 'https',
            hostname: 'picsum.photos'
        },
        {
            protocol: 'https',
            hostname: 'ui-avatars.com'
        },
        {
            protocol: 'https',
            hostname: 'prestashop.test'
        },
        {
            protocol: 'http',
            hostname: 'prestashop.test'
        },
        {
            protocol: 'https',
            hostname: 'flagcdn.com'
        }
       ],
    },
};

export default nextConfig;
