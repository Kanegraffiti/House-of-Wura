import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofwura.vercel.app';

const paths = ['/', '/services', '/shop', '/lookbook', '/about', '/contact', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified
  }));
}
