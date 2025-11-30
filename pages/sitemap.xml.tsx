import { GetServerSideProps } from 'next';

function generateSiteMap() {
 const baseUrl = 'https://wefronti.com'; // Atualizar com URL real
 
 return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
 xmlns:xhtml="http://www.w3.org/1999/xhtml">
 <!-- Página principal -->
 <url>
 <loc>${baseUrl}</loc>
 <lastmod>${new Date().toISOString()}</lastmod>
 <changefreq>weekly</changefreq>
 <priority>1.0</priority>
 <xhtml:link rel="alternate" hreflang="pt-BR" href="${baseUrl}" />
 </url>
 
</urlset>`;
}

function SiteMap() {
 // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
 // We generate the XML sitemap with the posts data
 const sitemap = generateSiteMap();

 res.setHeader('Content-Type', 'text/xml');
 // Cache por 24 horas
 res.setHeader(
 'Cache-Control',
 'public, s-maxage=86400, stale-while-revalidate=43200'
 );
 
 // Enviar XML para o stream de resposta
 res.write(sitemap);
 res.end();

 return {
 props: {},
 };
};

export default SiteMap;
