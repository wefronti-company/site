import { GetServerSideProps } from 'next';

function RobotsTxt() {
 // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
 const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wefronti.com'; 
 
 const robotsTxt = `# *
User-agent: *
Allow: /

# Google
User-agent: Googlebot
Allow: /

# Bing
User-agent: Bingbot
Allow: /

# Bloqueios
Disallow: /api/
Disallow: /_next/

# Imagens — rastreáveis pelo Google (logo, social, witor-linhares, bento)
User-agent: Googlebot-Image
Allow: /images/brand/logo.webp
Allow: /images/brand/social-seo-image.webp
Allow: /images/about/witor-linhares.webp
Allow: /images/bento/
Disallow: /images/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1
`;

 res.setHeader('Content-Type', 'text/plain');
 // Cache por 7 dias
 res.setHeader(
 'Cache-Control',
 'public, s-maxage=604800, stale-while-revalidate=86400'
 );
 
 res.write(robotsTxt);
 res.end();

 return {
 props: {},
 };
};

export default RobotsTxt;
