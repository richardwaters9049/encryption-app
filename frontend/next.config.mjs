/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Enables React strict mode
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Make the API URL available to the client-side
    },
};

export default nextConfig;
