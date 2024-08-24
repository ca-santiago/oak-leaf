/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com'
            },
            {
                protocol: "https",
                hostname: 's.gravatar.com'
            },
            {
                protocol: 'https',
                hostname: 'personel-public-files-e42.s3.amazonaws.com',
            },
        ]
    }
}

module.exports = nextConfig
