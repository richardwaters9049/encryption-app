/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Enables React strict mode
    experimental: {
        appDir: true, // If you are using the new app directory feature
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Make the API URL available to the client-side
    },
};

export default nextConfig;
